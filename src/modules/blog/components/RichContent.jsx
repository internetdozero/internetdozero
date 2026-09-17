import React from 'react';

const SAFE_HREF = /^(https?:|mailto:|tel:|#(?!\/)|\/(?!\/))/i;

/**
 * Renderizador de conteúdo editorial com tipografia polida,
 * links verdes sem sublinhado, destaques e espaçamento generoso.
 */
export function RichContent({ content = '' }) {
  if (!content) return null;

  const lines = content.replace(/\r\n/g, '\n').trim().split('\n');

  const renderInline = (text) => {
    // Parser seguro para: links [texto](url), negrito **texto**, e código `código`
    const parts = [];
    let remaining = text;
    let key = 0;

    // Expressão regular para links [label](href)
    const tokenRegex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`)/;

    while (remaining) {
      const match = remaining.match(tokenRegex);
      if (!match) {
        parts.push(remaining);
        break;
      }

      const matchIndex = match.index;
      if (matchIndex > 0) {
        parts.push(remaining.slice(0, matchIndex));
      }

      const token = match[0];
      if (token.startsWith('[') && token.includes('](')) {
        const label = token.slice(1, token.indexOf(']('));
        const href = token.slice(token.indexOf('](') + 2, -1);
        if (SAFE_HREF.test(href)) {
          parts.push(
            <a
              key={key++}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="text-emerald-500 hover:text-emerald-400 no-underline font-medium transition-colors cursor-pointer"
            >
              {label}
            </a>
          );
        } else {
          parts.push(<span key={key++} className="font-medium">{label}</span>);
        }
      } else if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong key={key++} className="font-bold text-zinc-900 dark:text-zinc-100">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('`') && token.endsWith('`')) {
        parts.push(
          <code key={key++} className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 font-mono text-xs">
            {token.slice(1, -1)}
          </code>
        );
      }

      remaining = remaining.slice(matchIndex + token.length);
    }

    return parts;
  };

  const blocks = [];
  for (let index = 0; index < lines.length;) {
    if (!lines[index].trim()) { index += 1; continue; }
    const line = lines[index].trim();
    if (/^(?:•|-|\*)\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^(?:•|-|\*)\s+/.test(lines[index].trim())) items.push(lines[index++].trim().replace(/^(?:•|-|\*)\s+/, ''));
      blocks.push({ type: 'ul', items });
      continue;
    }
    if (/^\d+[.)]\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^\d+[.)]\s+/.test(lines[index].trim())) items.push(lines[index++].trim().replace(/^\d+[.)]\s+/, ''));
      blocks.push({ type: 'ol', items });
      continue;
    }
    const paragraph = [];
    while (index < lines.length && lines[index].trim() && !/^(?:•|-|\*)\s+/.test(lines[index].trim()) && !/^\d+[.)]\s+/.test(lines[index].trim())) paragraph.push(lines[index++].trim());
    blocks.push({ type: 'p', text: paragraph.join(' ') });
  }

  return <div className="space-y-6 text-base sm:text-[17px] leading-relaxed font-sans text-zinc-700 dark:text-zinc-300">
    {blocks.map((block, idx) => {
      if (block.type === 'p') return <p key={idx}>{renderInline(block.text)}</p>;
      const List = block.type === 'ol' ? 'ol' : 'ul';
      return <List key={idx} className={`${block.type === 'ol' ? 'list-decimal' : 'list-disc'} space-y-3 pl-6 marker:text-emerald-500`}>
        {block.items.map((item, itemIndex) => <li key={itemIndex} className="pl-1">{renderInline(item)}</li>)}
      </List>;
    })}
  </div>;
}
