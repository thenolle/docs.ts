# Configuration

All configuration lives in `public/docs/config.json`. Loaded once at startup, applied before the first page renders.

## Top-level fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `title` | `string` | - | Site title in topbar and sidebar |
| `description` | `string` | - | Meta description |
| `version` | `string` | - | Version badge in the topbar |
| `defaultTheme` | `"dark"` `"light"` | `"dark"` | Initial color scheme |
| `themeToggle` | `boolean` | `true` | Show or hide the theme toggle |
| `scrollProgress` | `boolean` | `true` | Scroll progress bar |
| `landing` | `string` | `"index.md"` | Page loaded when no hash is present |

## Navigation

```json
{
  "nav": [
    { "label": "Home", "href": "index.md" },
    {
      "group": "Guide",
      "items": [
        { "label": "Install",       "href": "guide/install.md" },
        { "label": "Configuration", "href": "guide/configuration.md" }
      ]
    }
  ]
}
```

`href` is always relative to `public/docs/`. Flat items and groups can be mixed freely.

## Theme overrides

```json
{
  "theme": {
    "accent":      "#7c3aed",
    "accentHover": "#6d28d9",
    "bg":          "#0a0a0a",
    "surface":     "#111111",
    "fontBody":    "'Inter', sans-serif",
    "fontMono":    "'JetBrains Mono', monospace",
    "customCss":   ".chip { border-radius: 2px; }"
  }
}
```

All fields are optional. `customCss` is injected into a `<style>` tag on load.

## Logo

```json
{
  "logo": {
    "image": "./docs/assets/logo.png",
    "alt": "My Product"
  }
}
```

Or an inline SVG string:

```json
{
  "logo": {
    "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'>...</svg>"
  }
}
```

## Custom markdown rules

```json
{
  "customRules": [
    {
      "id":          "highlight",
      "pattern":     "==([^=]+)==",
      "flags":       "g",
      "replacement": "<mark>$1</mark>"
    },
    {
      "id":          "inline-kbd",
      "pattern":     "::kbd\\[([^\\]]+)\\]",
      "flags":       "g",
      "replacement": "<kbd>$1</kbd>"
    }
  ]
}
```

Rules run in array order after all built-in rendering. Replacements support `$1`, `$2`, or named groups `$<name>`.

:::warn[Rule ordering]
More specific rules should come before more general ones to avoid one rule consuming text meant for another.
:::