# docs.ts

A fast, dependency-free documentation engine built on ==Vite + TypeScript==.  
Drop in your `.md` files, configure the nav, and ship.

:::info[What is docs.ts?]
docs.ts renders a folder of Markdown files into a fully-featured documentation website -
with syntax highlighting, spoilers, chips, callouts, file imports, and a configurable theme.
No external parser dependency. No heavy framework.
:::

## Features

- **Zero runtime dependencies** - custom parser, custom highlighter, all in TypeScript
- **Chips** - ::chip[typescript] ::chip[stable]{green} ::chip[beta]{yellow} ::chip[deprecated]{red}
- **Spoilers**, callouts, file imports (`!!import[./file.svg]`)
- **Syntax highlighting** for TS, JS, JSON, CSS, HTML, Bash
- **Dark / light mode** toggle
- **`config.json`** controls nav, theme overrides, and custom regex rules
- Responsive sidebar with live nav search
- Scroll progress bar

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. Your docs are live.  
Edit `public/docs/config.json` to set your nav, then write `.md` files.

## Architecture

| File | Role |
|------|------|
| `src/lib/types.ts` | Shared TypeScript interfaces |
| `src/lib/config.ts` | Load and apply `config.json` |
| `src/lib/markdown.ts` | Custom block + inline parser |
| `src/lib/importer.ts` | Resolve `!!import[path]` at runtime |
| `src/lib/router.ts` | Hash-based SPA router |
| `src/lib/loader.ts` | Fetch -> import -> parse pipeline |
| `src/lib/ui.ts` | DOM shell, sidebar, all interactivity |
| `src/main.ts` | Boot entry point |

:::success[Ready to go!]
Explore the **Guide** and **Markdown Reference** sections in the sidebar.
:::