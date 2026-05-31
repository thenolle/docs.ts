# docs.ts

> A markdown-based documentation engine built on Vite + TypeScript.

docs.ts is a fast, dependency-free documentation engine that turns a folder of Markdown files into a fully featured documentation website.

No React. No Vue. No external markdown parser. No runtime dependencies.

## Features

- Zero runtime dependencies
- Custom Markdown parser written in TypeScript
- (Primitive) Syntax highlighting for:
  - TypeScript
  - JavaScript
  - JSON
  - CSS / SCSS
  - HTML / XML / SVG
  - Bash / Shell
- Callouts
- Spoilers
- Chips / badges
- Keyboard shortcut rendering
- File imports
- Dark and light themes
- Configurable navigation
- Theme customization
- Scroll progress indicator
- Responsive sidebar with search
- Runtime-loaded Markdown files
- GitHub Pages friendly
- Fully static output

---

## Quick Start

### Requirements

- Node.js 18+
- npm, pnpm, yarn, or Bun

### Installation

```bash
git clone https://github.com/thenolle/docs.ts.git
cd docs.ts
bun install # or npm install, pnpm install, yarn install
```

### Development

```bash
bun run dev # or npm run dev, pnpm run dev, yarn dev
```

Open:

```text
http://localhost:5173
```

---

## Build

```bash
bun run build # or npm run build, pnpm run build, yarn build
```

Production files are generated in:

```text
dist/
```

Preview the production build:

```bash
bun run preview # or npm run preview, pnpm run preview, yarn preview
```

---

## Project Structure

```text
public/
├── docs/
│   ├── config.json
│   ├── index.md
│   ├── guide/
│   ├── reference/
│   └── assets/
└── favicon.svg

src/
├── main.ts
├── globals.css
└── lib/
    ├── types.ts
    ├── config.ts
    ├── markdown.ts
    ├── importer.ts
    ├── router.ts
    ├── loader.ts
    └── ui.ts
```

---

## Configuration

All configuration lives in:

```text
public/docs/config.json
```

Example:

```json
{
  "title": "docs.ts",
  "description": "A markdown-based documentation engine built on Vite + TypeScript",
  "version": "v1.0.0",
  "defaultTheme": "dark",
  "themeToggle": true,
  "scrollProgress": true,
  "landing": "index.md"
}
```

### Navigation

```json
{
  "nav": [
    {
      "label": "Introduction",
      "href": "index.md"
    },
    {
      "group": "Guide",
      "items": [
        {
          "label": "Getting Started",
          "href": "guide/getting-started.md"
        }
      ]
    }
  ]
}
```

### Theme Overrides

```json
{
  "theme": {
    "accent": "#ff88ff",
    "accentHover": "#ff99ff"
  }
}
```

---

## Writing Documentation

Markdown files live inside:

```text
public/docs/
```

Example:

```text
public/docs/
├── index.md
├── guide/
│   └── getting-started.md
└── api/
    └── reference.md
```

Reference them from navigation using paths relative to `public/docs/`.

```json
{
  "label": "API Reference",
  "href": "api/reference.md"
}
```

---

## Supported Markdown Features

### Formatting [default]

```md
**bold**
_italic_
~~strikethrough~~
`code`
```

### Callouts [custom]

```md
:::
Information
:::

:::
Warning
:::

:::
Danger
:::

:::
Success
:::
```

### Chips [custom]

```md
::chip[stable]
::chip[beta]{yellow}
::chip[deprecated]{red}
```

### Spoilers [custom]

```md
:::
Hidden content
:::
```

### Keyboard Keys [custom]

```md
Press [[Ctrl+S]] to save.
```

### Custom Rules

```md
==highlight==
::v[1.0.0]
::since[v0.5.0]
```

Custom transformations can be defined in `config.json`.

---

## File Imports

Embed external files directly inside documentation pages.

### SVG

```md
!!import[./assets/logo.svg]
```

Renders as inline SVG.

### JSON

```md
!!import[./assets/config.json]
```

Renders as syntax-highlighted JSON.

### Code

```md
!!import[./assets/example.ts]
```

Renders as a syntax-highlighted code block.

---

## Runtime Loading

Markdown files are loaded via `fetch()` at runtime.

This means:

- No Markdown bundling
- No rebuild required when editing documentation
- Add, rename, or remove pages freely
- Simply refresh the browser during development

---

## Deployment

docs.ts generates a fully static site and can be deployed anywhere.

### GitHub Pages

A GitHub Actions workflow is included for automatic deployment.

### Vercel

```bash
vercel --prod
```

### Netlify

Upload the `dist/` directory.

### Nginx

```bash
cp -r dist/* /var/www/html/
```

---

## Tech Stack

- TypeScript
- Vite
- Tailwind CSS v4
- Terser
- Bun
- Custom Markdown Engine

---

## Philosophy

docs.ts focuses on:

- Simplicity
- Performance
- Minimal dependencies
- Predictable output
- Easy self-hosting
- Long-term maintainability

Everything is built around a lightweight TypeScript codebase rather than a large framework ecosystem.

---

## License

[MIT License](LICENSE)

> Protect them dolls 🏳️‍⚧️