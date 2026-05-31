# Getting Started

## Prerequisites

- **Node.js** 18 or newer
- **npm**, pnpm, or yarn, or bun

## Installation

```bash
git clone https://github.com/you/docs-ts
cd docs-ts
npm install
```

## Dev server

```bash
npm run dev
```

Visit `http://localhost:5173`. The engine loads docs from `public/docs/` at runtime - no rebuild needed when you edit `.md` files, just refresh.

## Production build

```bash
npm run build
```

Output lands in `dist/`. Deploy to any static host:

| Host | How |
|------|-----|
| Vercel | `vercel --prod` |
| Netlify | drag-drop `dist/` |
| GitHub Pages | push `dist/` to `gh-pages` branch |
| nginx | `cp -r dist/* /var/www/html/` |

:::warn[Sub-path deployments]
If you deploy under a sub-path (e.g. `/docs-ts/`), set `base: '/docs-ts/'` in `vite.config.ts`.
:::

## Project structure
```
project/
├── public/
│ ├── favicon.svg
│ └── docs/
│ ├── config.json
│ ├── index.md
│ ├── guide/
│ ├── reference/
│ └── assets/
└── src/
├── globals.css
├── main.ts
└── lib/
├── types.ts
├── config.ts
├── markdown.ts
├── importer.ts
├── router.ts
├── loader.ts
└── ui.ts
```

:::info[No bundling of .md files]
Markdown files live in `public/` and are fetched at runtime. Add, rename, or delete pages without rebuilding.
:::