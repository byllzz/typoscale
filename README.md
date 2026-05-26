# TypoScale

**Generate beautiful type scales, pair Google Fonts, and export ready-to-use CSS & Tailwind tokens.**

![TypoScale screenshot](https://via.placeholder.com/1200x630/0c0a09/f59e0b?text=TypoScale)

## Features

- **Google Fonts browser** — search and preview 1000+ fonts by category
- **Font pairing** — separate pickers for display, body, and monospace
- **Scale algorithms** — Minor Second, Major Third, Perfect Fourth, Golden Ratio, and custom ratios
- **Live preview** — editorial layout showing every scale step in your chosen fonts
- **WCAG contrast badges** — AA/AAA pass/fail per scale step
- **Token output** in four formats:
  - CSS Custom Properties
  - Tailwind CSS v3 (`theme.extend.fontSize`)
  - Tailwind CSS v4 (`@theme`)
  - Style Dictionary JSON
- **Shareable URLs** — scale config encoded in query params, copy with one click

## Quick start

```bash
# 1. Clone
git clone https://github.com/yourusername/typoscale.git
cd typoscale

# 2. Install
npm install

# 3. Add your Google Fonts API key (optional — falls back to curated list)
cp .env.local.example .env.local
# Edit .env.local and add: VITE_GOOGLE_FONTS_KEY=your_key_here

# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Get a Google Fonts API key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create or select a project
3. Navigate to **APIs & Services → Library**
4. Search for **"Web Fonts Developer API"** and enable it
5. Go to **APIs & Services → Credentials → Create Credentials → API Key**
6. Copy the key into `.env.local` as `VITE_GOOGLE_FONTS_KEY`

The app works without a key — it falls back to a curated list of 28 popular fonts.

## Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

Add `VITE_GOOGLE_FONTS_KEY` in Vercel's dashboard under **Settings → Environment Variables**.

One-click deploy:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/typoscale)

## Project structure

```
src/
├── components/
│   ├── FontPicker.tsx      # Searchable Google Fonts dropdown
│   ├── ScaleControls.tsx   # Left sidebar with all controls
│   ├── ScaleTable.tsx      # Scale steps table with WCAG badges
│   ├── PreviewPane.tsx     # Editorial live preview
│   ├── TokenOutput.tsx     # Code output with syntax highlight
│   ├── MainArea.tsx        # Right panel layout
│   └── PrismTheme.tsx      # Syntax highlight theme
├── hooks/
│   ├── useFonts.ts         # Google Fonts API + search
│   ├── useTypeScale.ts     # Reactive scale computation
│   └── useClipboard.ts     # Copy to clipboard
├── utils/
│   ├── scaleAlgorithms.ts  # Pure scale math
│   ├── tokenGenerators.ts  # CSS/Tailwind/JSON output
│   └── contrast.ts         # WCAG contrast calculation
├── store/
│   └── useStore.ts         # Zustand state + URL persistence
└── types/
    └── index.ts            # Shared TypeScript types
```

## Token output examples

### CSS Custom Properties
```css
:root {
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'Source Sans 3', system-ui, sans-serif;
  --font-size-base: 1rem; /* 16px */
  --font-size-xl: 1.333rem; /* 21.33px */
  --font-size-2xl: 1.777rem; /* 28.44px */
}
```

### Tailwind v3
```js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      fontSize: {
        base: ['1rem', { lineHeight: '1.5', letterSpacing: '0em' }],
        xl:   ['1.333rem', { lineHeight: '1.3', letterSpacing: '0em' }],
      },
    },
  },
}
```

### Tailwind v4
```css
@import "tailwindcss";

@theme {
  --font-family-display: 'Playfair Display', Georgia, serif;
  --font-size-base: 1rem;
  --font-size-xl: 1.333rem;
}
```

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `Ctrl/Cmd + C` | Copy current token output |
| `Ctrl/Cmd + D` | Toggle dark preview |

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push: `git push origin feat/your-feature`
5. Open a Pull Request

Please run `npm run type-check && npm run lint` before opening a PR.

## License

MIT © 2024 — see [LICENSE](LICENSE) for details.
