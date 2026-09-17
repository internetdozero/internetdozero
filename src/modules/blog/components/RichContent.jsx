import React from 'react';

const SAFE_HREF = /^(https?:|mailto:|tel:|#(?!\/)|\/(?!\/))/i;

/**
 * Renderizador de conteúdo editorial com tipografia polida,
 * links verdes sem sublinhado, destaques e espaçamento generoso.
 */
export function RichContent({ content = '' }) {
  if (!content) return null;

  // Divide o texto por blocos de parágrafos duplos
  const paragraphs = content.split(/\n\n+/);

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

  return (
    <div className="space-y-5 text-base sm:text-[17px] leading-relaxed font-sans text-zinc-700 dark:text-zinc-300">
      {paragraphs.map((p, idx) => {
        const trimmed = p.trim();

        // Título de subseção numerada: ex "1. TechCrunch" ou "1. Titulo"
        if (/^\d+\.\s+/.test(trimmed)) {
          const numMatch = trimmed.match(/^(\d+\.)\s+(.+)$/);
          if (numMatch) {
            const [, num, title] = numMatch;
            return (
              <h3 key={idx} className="text-xl sm:text-2xl font-bold font-sans text-zinc-900 dark:text-white pt-3 flex items-baseline gap-2">
                <span>{num}</span>
                <span className="text-emerald-500 hover:text-emerald-400 transition-colors">
                  {renderInline(title)}
                </span>
              </h3>
            );
          }
        }

        // Lista com marcadores
        if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
          const items = trimmed.split('\n');
          return (
            <ul key={idx} className="space-y-2 pl-2 my-3">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-emerald-500 font-bold mt-1 text-sm">•</span>
                  <span className="flex-1">{renderInline(item.replace(/^[•-]\s+/, ''))}</span>
                </li>
              ))}
            </ul>
          );
        }

        return <p key={idx}>{renderInline(trimmed)}</p>;
      })}
    </div>
  );
}
