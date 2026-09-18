import { describe, expect, it, vi, afterEach } from 'vitest';
import { findLicensedImage } from '../workers/internetdozero-cron/src/pipeline/image.js';

describe('findLicensedImage (Multi-provider photo filtering & deduplication)', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('filters out insecure, unapproved licenses, and invalid images from Openverse', async () => {
    globalThis.fetch = vi.fn().mockImplementation(async (url) => {
      if (url.includes('api.openverse.org')) {
        return {
          ok: true,
          json: async () => ({
            results: [
              {
                url: 'http://insecure.com/photo.jpg',
                thumbnail: 'http://insecure.com/thumb.jpg',
                license: 'cc0'
              },
              {
                url: 'https://example.com/forbidden.jpg',
                thumbnail: 'https://example.com/thumb.jpg',
                license: 'all-rights-reserved'
              },
              {
                url: 'https://example.com/tiny.jpg',
                thumbnail: 'https://example.com/thumb.jpg',
                license: 'cc0',
                width: 100,
                height: 80
              },
              {
                title: 'Cloud Datacenter Server',
                url: 'https://images.org/datacenter.jpg',
                thumbnail: 'https://images.org/thumb.jpg',
                license: 'by',
                license_version: '4.0',
                creator: 'Jane Doe',
                foreign_landing_url: 'https://openverse.org/image/123',
                source: 'flickr',
                width: 1920,
                height: 1080
              }
            ]
          })
        };
      }
      return { ok: false, status: 404 };
    });

    const result = await findLicensedImage({
      query: 'datacenter server',
      title: 'Segurança em Nuvem',
      category: 'Segurança'
    });

    expect(result).not.toBeNull();
    expect(result.image_url).toBe('https://images.org/datacenter.jpg');
    expect(result.image_license).toBe('CC BY 4.0');
    expect(result.image_author).toBe('Jane Doe');
    expect(result.image_source).toBe('Openverse (flickr)');
  });

  it('fetches and sanitizes images from Wikimedia Commons', async () => {
    globalThis.fetch = vi.fn().mockImplementation(async (url) => {
      if (url.includes('commons.wikimedia.org')) {
        return {
          ok: true,
          json: async () => ({
            query: {
              pages: {
                101: {
                  title: 'File:Television_broadcast_studio.jpg',
                  imageinfo: [
                    {
                      url: 'https://upload.wikimedia.org/wikipedia/commons/full.jpg',
                      thumburl: 'https://upload.wikimedia.org/wikipedia/commons/thumb.jpg',
                      descriptionurl: 'https://commons.wikimedia.org/wiki/File:Television_broadcast_studio.jpg',
                      mime: 'image/jpeg',
                      width: 1920,
                      height: 1080,
                      extmetadata: {
                        Artist: { value: '<a href="https://example.com">Fotógrafo TV</a>' },
                        LicenseShortName: { value: 'CC BY-SA 4.0' }
                      }
                    }
                  ]
                }
              }
            }
          })
        };
      }
      return { ok: false, status: 404 };
    });

    const result = await findLicensedImage({
      query: 'television studio broadcast',
      title: 'Bastidores da Novela',
      category: 'Cultura'
    });

    expect(result).not.toBeNull();
    expect(result.image_url).toBe('https://upload.wikimedia.org/wikipedia/commons/thumb.jpg');
    expect(result.image_author).toBe('Fotógrafo TV');
    expect(result.image_source).toBe('Wikimedia Commons');
    expect(result.image_license).toBe('CC BY-SA 4.0');
  });

  it('uses Pexels when PEXELS_API_KEY is configured in env', async () => {
    globalThis.fetch = vi.fn().mockImplementation(async (url) => {
      if (url.includes('api.pexels.com')) {
        return {
          ok: true,
          json: async () => ({
            photos: [
              {
                url: 'https://pexels.com/photo/12345',
                photographer: 'Carlos Silva',
                src: {
                  large2x: 'https://images.pexels.com/photos/12345/landscape.jpg',
                  medium: 'https://images.pexels.com/photos/12345/thumb.jpg'
                }
              }
            ]
          })
        };
      }
      return { ok: false, status: 404 };
    });

    const result = await findLicensedImage(
      { query: 'cybersecurity server' },
      { env: { PEXELS_API_KEY: 'test-pexels-key' } }
    );

    expect(result).not.toBeNull();
    expect(result.image_url).toBe('https://images.pexels.com/photos/12345/landscape.jpg');
    expect(result.image_source).toBe('Pexels');
    expect(result.image_author).toBe('Carlos Silva');
  });

  it('skips already used URLs based on D1 database history', async () => {
    const mockDb = {
      prepare: vi.fn().mockReturnValue({
        all: vi.fn().mockResolvedValue({
          results: [{ image_url: 'https://images.org/repeated.jpg' }]
        })
      })
    };

    globalThis.fetch = vi.fn().mockImplementation(async (url) => {
      if (url.includes('api.openverse.org')) {
        return {
          ok: true,
          json: async () => ({
            results: [
              {
                title: 'Repeated Photo',
                url: 'https://images.org/repeated.jpg', // should be filtered out because it's in D1
                thumbnail: 'https://images.org/thumb1.jpg',
                license: 'cc0',
                width: 1000,
                height: 600
              },
              {
                title: 'Fresh Unique Photo',
                url: 'https://images.org/fresh.jpg',
                thumbnail: 'https://images.org/thumb2.jpg',
                license: 'cc0',
                width: 1000,
                height: 600,
                creator: 'New Artist'
              }
            ]
          })
        };
      }
      return { ok: false, status: 404 };
    });

    const result = await findLicensedImage(
      { query: 'fresh topic' },
      { db: mockDb }
    );

    expect(result).not.toBeNull();
    expect(result.image_url).toBe('https://images.org/fresh.jpg');
    expect(result.image_author).toBe('New Artist');
  });

  it('returns null gracefully when all APIs fail or return no valid candidates', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500
    });

    const result = await findLicensedImage({
      title: 'Título Desconhecido',
      category: 'Geral'
    });

    expect(result).toBeNull();
  });
});
