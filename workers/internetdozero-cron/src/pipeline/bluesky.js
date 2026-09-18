export async function postToBluesky(postData, env) {
  const identifier = env.BSKY_IDENTIFIER || 'internetdozero.bsky.social';
  const password = env.BSKY_APP_PASSWORD;

  if (!identifier || !password) {
    console.log('Bluesky credentials not provided. Skipping Bluesky broadcast.');
    return null;
  }

  try {
    // 1. Create Session
    const sessionRes = await fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });

    if (!sessionRes.ok) {
      console.error('Bluesky auth error:', await sessionRes.text());
      return null;
    }

    const { accessJwt, did } = await sessionRes.json();

    // 2. Format URL and Text
    const categorySlug = (postData.category || 'geral')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const articleUrl = `https://internetdozero.com.br/blog/${categorySlug}/${encodeURIComponent(postData.slug)}`;
    
    let text = `📢 Novo no Internet do Zero:\n\n${postData.title}\n\n👉 ${articleUrl}`;

    if (postData.tags && Array.isArray(postData.tags)) {
      const hashtags = postData.tags
        .slice(0, 3)
        .map(t => '#' + t.replace(/[^a-zA-Z0-9]/g, ''))
        .filter(t => t.length > 2)
        .join(' ');
      if (hashtags && (text.length + hashtags.length + 2) <= 290) {
        text += `\n\n${hashtags}`;
      }
    }

    const facets = extractFacets(text);

    const record = {
      $type: 'app.bsky.feed.post',
      text,
      facets,
      createdAt: new Date().toISOString(),
      embed: {
        $type: 'app.bsky.embed.external',
        external: {
          uri: articleUrl,
          title: postData.title,
          description: postData.subtitle || 'Leia no Internet do Zero'
        }
      }
    };

    const postRes = await fetch('https://bsky.social/xrpc/com.atproto.repo.createRecord', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessJwt}`
      },
      body: JSON.stringify({
        repo: did,
        collection: 'app.bsky.feed.post',
        record
      })
    });

    if (!postRes.ok) {
      console.error('Bluesky createRecord error:', await postRes.text());
      return null;
    }

    const postJson = await postRes.json();
    console.log('Successfully posted to Bluesky:', postJson.uri);
    return postJson;
  } catch (err) {
    console.error('Bluesky broadcast failed:', err);
    return null;
  }
}

function extractFacets(text) {
  const facets = [];
  const encoder = new TextEncoder();

  // 1. URLs
  const urlRegex = /https?:\/\/[^\s]+/g;
  let match;
  while ((match = urlRegex.exec(text)) !== null) {
    const matchedUrl = match[0];
    const prefix = text.slice(0, match.index);
    const byteStart = encoder.encode(prefix).byteLength;
    const byteEnd = byteStart + encoder.encode(matchedUrl).byteLength;

    facets.push({
      index: { byteStart, byteEnd },
      features: [{
        $type: 'app.bsky.richtext.facet#link',
        uri: matchedUrl
      }]
    });
  }

  // 2. Hashtags
  const tagRegex = /(?:^|\s)(#[a-zA-Z0-9_]+)/g;
  while ((match = tagRegex.exec(text)) !== null) {
    const fullMatch = match[0];
    const tag = match[1];
    const tagStartIndex = match.index + (fullMatch.length - tag.length);
    const prefix = text.slice(0, tagStartIndex);
    const byteStart = encoder.encode(prefix).byteLength;
    const byteEnd = byteStart + encoder.encode(tag).byteLength;

    facets.push({
      index: { byteStart, byteEnd },
      features: [{
        $type: 'app.bsky.richtext.facet#tag',
        tag: tag.replace(/^#/, '')
      }]
    });
  }

  return facets;
}
