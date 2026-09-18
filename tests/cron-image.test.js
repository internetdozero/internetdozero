import { describe, expect, it, vi, afterEach } from 'vitest';
import { findLicensedImage } from '../workers/internetdozero-cron/src/pipeline/image.js';

describe('findLicensedImage (Openverse photo filtering)', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('filters out insecure, unapproved licenses, and invalid images', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          {
            url: 'http://insecure.com/photo.jpg', // insecure http
            thumbnail: 'http://insecure.com/thumb.jpg',
            license: 'cc0'
          },
          {
            url: 'https://example.com/forbidden.jpg',
            thumbnail: 'https://example.com/thumb.jpg',
            license: 'all-rights-reserved' // unapproved license
          },
          {
            url: 'https://example.com/tiny.jpg',
            thumbnail: 'https://example.com/thumb.jpg',
            license: 'cc0',
            width: 100, // tiny dimensions
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

  it('sanitizes camera default filenames and falls back to article title', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          {
            title: 'IMG_9924.JPG',
            url: 'https://images.org/photo.jpg',
            thumbnail: 'https://images.org/thumb.jpg',
            license: 'cc0'
          }
        ]
      })
    });

    const result = await findLicensedImage({
      title: 'Guia de Backup Seguro',
      category: 'Tecnologia'
    });

    expect(result).not.toBeNull();
    expect(result.image_alt).toBe('Imagem ilustrativa sobre Guia de Backup Seguro');
  });

  it('returns null gracefully when API fails or returns no valid candidates', async () => {
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
