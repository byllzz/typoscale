# <a href="https://typoscale.vercel.app" target="_blank">TypoScale - Type Scale Generator</a>

> Generate beautiful type scales, pair Google Fonts, and export ready-to-use CSS & Tailwind tokens.

<p align="left">
  <img src="https://img.shields.io/badge/Status-active-amber?style=flat&color=9B72FF" />
  <img src="https://img.shields.io/badge/Built%20with-React%20%2B%20Vite-9B72FF?style=flat" />
  <img src="https://img.shields.io/badge/Styling-Tailwind%20CSS-9B72FF?style=flat" />
  <img src="https://img.shields.io/badge/License-MIT-9B72FF?style=flat" />
  <img src="https://img.shields.io/badge/TypeScript-strict-9B72FF?style=flat" />
  <img src="https://img.shields.io/badge/Deployed%20on-Vercel-9B72FF?style=flat" />
</p>

[![Visit TypoScale](https://img.shields.io/badge/Live%20Demo-typoscale-9B72FF?style=flat)](https://typoscale.vercel.app)

<img width="100%" alt="TypoScale Preview" src="./src/assets/previews/Preview1.png" />
<br />
<!-- <img width="100%" alt="TypoScale Preview" src="./src/assets/previews/Preview2.png" /> -->

⭐ **Star this repo** if TypoScale saved you from hand-calculating `1.333rem` for the hundredth time.

---

## What is TypoScale?

TypoScale is a **browser-based type scale generator** for designers and developers who build design systems. Pick a base size, choose a modular ratio, pair Google Fonts, and get production-ready tokens in CSS, Tailwind v3/v4, or Style Dictionary JSON — all in one place, with a live editorial preview that shows exactly what your scale looks like in real fonts.

No sign-up. No backend. Fully open source.

---

## Features

**Scale generation**
- Modular ratios — Minor Second, Major Second, Minor Third, Major Third, Perfect Fourth, Augmented Fourth, Perfect Fifth, Golden Ratio, and any custom ratio
- Set a custom base size (default 16px)
- Add steps above and below the base independently

**Font pairing**
- Search and preview 1000+ Google Fonts by category
- Separate pickers for display, body, and monospace
- Fonts load on demand — no bloat

**Live preview**
- Editorial layout showing every scale step in your chosen fonts
- WCAG AA/AAA contrast badges per step
- Responsive fluid preview — drag to resize and see how the scale behaves

**Token export — four formats**
- CSS Custom Properties
- Tailwind CSS v3 (`theme.extend.fontSize`)
- Tailwind CSS v4 (`@theme`)
- Style Dictionary JSON
- One-click copy or download per format

**Developer experience**
- Shareable URLs — full scale config encoded in query params
- Dark and light mode
- Zero dependencies on your end — just open and use

---

## Quick start

```bash
# 1. Clone
git clone https://github.com/byllzz/typoscale.git
cd typoscale

# 2. Install
npm install

# 3. Add your Google Fonts API key (optional — falls back to curated list of 28 fonts)
cp .env.local.example .env.local
# Edit .env.local → VITE_GOOGLE_FONTS_KEY=your_key_here

# 4. Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Get a Google Fonts API key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create or select a project
3. Navigate to **APIs & Services → Library**
4. Search for **Web Fonts Developer API** and enable it
5. Go to **APIs & Services → Credentials → Create Credentials → API Key**
6. Copy the key into `.env.local` as `VITE_GOOGLE_FONTS_KEY`

The app works without a key and falls back to a curated list of 28 popular fonts.

---

## Deploy

### Vercel (recommended)

```bash
npm install -g vercel
vercel --prod
```

Add `VITE_GOOGLE_FONTS_KEY` under **Settings → Environment Variables** in your Vercel dashboard.

One-click deploy:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/byllzz/typoscale)

---

## Token output examples

### CSS Custom Properties
```css
:root {
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'Source Sans 3', system-ui, sans-serif;
  --font-size-base: 1rem;       /* 16px */
  --font-size-lg: 1.333rem;     /* 21.33px */
  --font-size-xl: 1.777rem;     /* 28.44px */
  --font-size-2xl: 2.369rem;    /* 37.90px */
}
```

### Tailwind v3
```js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Source Sans 3', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        base: ['1rem',     { lineHeight: '1.5' }],
        lg:   ['1.333rem', { lineHeight: '1.4' }],
        xl:   ['1.777rem', { lineHeight: '1.3' }],
        '2xl':['2.369rem', { lineHeight: '1.2' }],
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
  --font-size-lg:   1.333rem;
  --font-size-xl:   1.777rem;
  --font-size-2xl:  2.369rem;
}
```

### Style Dictionary JSON
```json
{
  "typography": {
    "scale": {
      "base": { "value": "1rem",      "type": "fontSizes" },
      "lg":   { "value": "1.333rem",  "type": "fontSizes" },
      "xl":   { "value": "1.777rem",  "type": "fontSizes" }
    }
  }
}
```

---

## Project structure

```
typoscale/
├── public/
├── src/
│   ├── components/
│   │   ├── FontPicker.tsx       # Searchable Google Fonts dropdown
│   │   ├── ScaleControls.tsx    # Left sidebar — all controls
│   │   ├── ScaleTable.tsx       # Scale steps table with WCAG badges
│   │   ├── PreviewPane.tsx      # Editorial live preview
│   │   ├── TokenOutput.tsx      # Code output with syntax highlight
│   │   ├── FluidExport.tsx      # clamp()-based fluid typography export
│   │   ├── WelcomeNote.tsx      # First-visit welcome modal
│   │   ├── MainArea.tsx         # Right panel layout
│   │   └── PrismTheme.tsx       # Syntax highlight theme injection
│   ├── hooks/
│   │   ├── useFonts.ts          # Google Fonts API + search
│   │   ├── useTypeScale.ts      # Reactive scale computation
│   │   └── useClipboard.ts      # Copy to clipboard
│   ├── utils/
│   │   ├── scaleAlgorithms.ts   # Pure scale math
│   │   ├── tokenGenerators.ts   # CSS / Tailwind / JSON output
│   │   ├── fluidTypography.ts   # clamp() generation
│   │   └── contrast.ts          # WCAG contrast calculation
│   ├── store/
│   │   └── useStore.ts          # Zustand state + URL persistence
│   ├── types/
│   │   └── index.ts             # Shared TypeScript types
│   └── App.tsx
├── .env.local.example
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

---

<!-- ## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `Ctrl / Cmd + C` | Copy current token output |
| `Ctrl / Cmd + D` | Toggle dark preview |

--- -->

## Tech stack

| Tool | Purpose |
|------|---------|
| [React](https://react.dev/) + [Vite](https://vitejs.dev/) | UI and build tooling |
| [TypeScript](https://www.typescriptlang.org/) | Type safety throughout |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [Zustand](https://docs.pmnd.rs/zustand) | State management + URL persistence |
| [Lucide React](https://lucide.dev/) | Icon set |
| [Vercel](https://vercel.com) | Deployment and hosting |

---

## Contributing

Contributions are welcome. Please open an issue before starting significant work so we can discuss the approach.

```bash
# 1. Fork the repo and clone your fork
git clone https://github.com/your-fork/typoscale.git
cd typoscale

# 2. Create a feature branch
git checkout -b feat/your-feature

# 3. Make your changes, then run checks
npm run type-check
npm run lint

# 4. Commit using conventional commits
git commit -m "feat(component): short description"

# 5. Push and open a pull request against main
git push origin feat/your-feature
```

### Good first issues

- Adding new scale ratio presets
- Improving WCAG contrast badge accuracy
- Adding a fluid type scale preview mode
- Accessibility improvements (ARIA labels, keyboard nav)
- Writing unit tests for `scaleAlgorithms.ts` and `tokenGenerators.ts`

### Commit convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | When to use |
|--------|------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code change that isn't a fix or feature |
| `style` | Formatting, spacing, visual-only changes |
| `docs` | Documentation only |
| `chore` | Build, deps, config |

---

## License

MIT © 2024 - see [LICENSE](LICENSE) for details.
