export function PrismTheme() {
  return (
    <style>{`
      /* Prism dark theme for TypoScale */
      code[class*="language-"],
      pre[class*="language-"] {
        color: #d4c5a9;
        background: none;
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, Monaco, monospace;
        font-size: 0.8125rem;
        line-height: 1.7;
        text-align: left;
        white-space: pre;
        word-spacing: normal;
        word-break: normal;
        tab-size: 2;
        hyphens: none;
      }
      .token.comment { color: #57534e; font-style: italic; }
      .token.punctuation { color: #78716c; }
      .token.property { color: #f59e0b; }
      .token.selector, .token.tag { color: #d97706; }
      .token.boolean, .token.number, .token.constant { color: #6ee7b7; }
      .token.string, .token.char, .token.attr-value { color: #86efac; }
      .token.operator { color: #a8a29e; }
      .token.keyword { color: #fca5a5; }
      .token.function { color: #93c5fd; }
      .token.regex, .token.important { color: #fbbf24; }
      .token.atrule { color: #d97706; }
      .token.attr-name { color: #a78bfa; }
      .token.unit { color: #6ee7b7; }
    `}</style>
  )
}
