# Writing Pages

## Where files live

All `.md` files go inside `public/docs/`. Any subfolder structure works:
```
public/docs/
├── config.json
├── index.md
├── guide/
│ └── intro.md
└── api/
└── reference.md
```


Reference them in `config.json` by path relative to `public/docs/`:

```json
{ "label": "API Reference", "href": "api/reference.md" }
```

## Page titles

The first `# Heading` in your file becomes the page title. No front matter, no YAML.

## Missing or empty pages

If a file returns a 404 or is completely empty, the engine shows a friendly ==empty doc== screen with setup steps instead of a blank page or crash.

## Internal links

```markdown
[Go to Configuration](guide/configuration.md)
[Back to Home](index.md)
```

Paths are relative to `public/docs/`. The router intercepts `.md` hrefs and renders them without a full reload. External links (`http…`) open in a new tab automatically.

## Images

```markdown
![Screenshot](./assets/screenshot.png "Optional caption")
```

Caption text renders as a `<figcaption>` below the image.

![Logo](./docs/assets/logo.svg "Optional caption")

## Videos & GIFs

```markdown
![Demo](./assets/demo.mp4 "Optional caption")
```

Extensions `.mp4`, `.webm`, `.ogg`, `.mov` render as `<video controls>`. Everything else (including `.gif`) renders as `<img>`.

![Demo](./docs/assets/demo.mp4 "Optional caption")
![Demo](./docs/assets/demo.gif "Optional caption")

## Importing files

```markdown
!!import[./assets/logo.svg]
!!import[./assets/config-example.json]
!!import[./assets/snippet.ts]
```

- **SVG** -> real inline `<svg>`, inherits `currentColor`
- **JSON** -> syntax-highlighted JSON block
- **Anything else** -> syntax-highlighted code block, language from extension

See [File Imports](reference/imports.md) for the full reference.