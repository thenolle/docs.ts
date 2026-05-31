# File Imports

Use `!!import[path]` on its own line to embed an external file into the page. Paths resolve relative to the current `.md` file.

## SVG import

```markdown
!!import[../assets/logo.svg]
```

SVG files are injected as **real inline `<svg>` HTML** - `currentColor` works for theming.

!!import[../assets/logo.svg]

## JSON import

```markdown
!!import[../assets/sample.json]
```

JSON files render as a syntax-highlighted block.

!!import[../assets/sample.json]

## TypeScript / code import

```markdown
!!import[../assets/snippet.ts]
```

Any other extension renders as a syntax-highlighted block, language detected from the extension.

!!import[../assets/snippet.ts]

## Path resolution

Paths are always **relative to the source `.md` file**:
```
public/docs/
├── reference/
│ └── imports.md <- this file
└── assets/
├── logo.svg <- !!import[../assets/logo.svg] ✓
├── sample.json <- !!import[../assets/sample.json] ✓
└── snippet.ts <- !!import[../assets/snippet.ts] ✓
```

:::warn[Files must be inside public/]
Imported files are fetched at runtime via `fetch()`. They must live inside `public/` so Vite can serve them.
:::

:::info[Failed imports]
If a file cannot be loaded, a warning callout is shown - the page does not crash.
:::