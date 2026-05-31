# Code Blocks

Fenced code blocks use triple backticks with an optional language tag. Hover any block to reveal the **copy** button.

## Supported languages

| Tag | Language |
|-----|----------|
| `ts` / `typescript` | TypeScript |
| `js` / `javascript` | JavaScript |
| `json` | JSON |
| `css` / `scss` | CSS |
| `html` / `xml` / `svg` | HTML / XML |
| `bash` / `sh` / `shell` / `zsh` | Bash / Shell |

## TypeScript

```ts
import type { DocsConfig } from './types.ts'

export async function loadConfig(): Promise<DocsConfig> {
  const res = await fetch('./docs/config.json')
  if (!res.ok) throw new Error(`Config load failed: ${res.status}`)
  return res.json() as Promise<DocsConfig>
}

export function applyTheme(config: DocsConfig): void {
  const t = config.theme
  if (!t) return
  const root = document.documentElement
  if (t.accent)      root.style.setProperty('--accent', t.accent)
  if (t.accentHover) root.style.setProperty('--accent-hover', t.accentHover)
  if (t.customCss) {
    const style = document.createElement('style')
    style.textContent = t.customCss
    document.head.appendChild(style)
  }
}
```

## JavaScript

```js
const debounce = (fn, delay = 200) => {
  let timer = null
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

window.addEventListener('hashchange', () => {
  const path = window.location.hash.replace(/^#\/?/, '') || 'index.md'
  loadPage(path)
})
```

## JSON

```json
{
  "title": "docs.ts",
  "version": "v1.0.0",
  "defaultTheme": "dark",
  "theme": {
    "accent": "#3d9fa8",
    "accentHover": "#4db5bf"
  },
  "nav": [
    { "label": "Introduction", "href": "index.md" },
    {
      "group": "Guide",
      "items": [
        { "label": "Getting Started", "href": "guide/getting-started.md" }
      ]
    }
  ]
}
```

## CSS

```css
.callout {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-lg);
  border: 1px solid var(--info-border);
  background: var(--info-dim);
  font-size: var(--text-sm);
}

.callout-warn   { background: var(--warn-dim);    border-color: var(--warn-border); }
.callout-danger { background: var(--error-dim);   border-color: var(--error-border); }
.callout-success{ background: var(--success-dim); border-color: var(--success-border); }
```

## HTML

```html
<div class="callout callout-info">
  <strong>Note</strong>
  <p>Rendered from <code>:::info[Note]</code> in markdown.</p>
</div>
```

## Bash

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

## Copy button

Hover any code block - a **copy** button fades in at the top-right. It copies the raw source (not the highlighted HTML) and shows `copied!` for 2 seconds. The language badge fades out simultaneously so they never overlap.