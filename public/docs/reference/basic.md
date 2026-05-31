# Basic Syntax

## Headings

```markdown
# H1 - page title, one per page
## H2 - major section, adds a divider line
### H3 - subsection
#### H4 - small section
##### H5 - uppercase label style
```

# H1 - page title, one per page
## H2 - major section, adds a divider line
### H3 - subsection
#### H4 - small section
##### H5 - uppercase label style

## Text formatting

| Syntax | Output |
|--------|--------|
| `**bold**` | **bold** |
| `_italic_` | _italic_ |
| `***bold italic***` | ***bold italic*** |
| `~~strikethrough~~` | ~~strikethrough~~ |
| `` `inline code` `` | `inline code` |

**bold** _italic_ ***bold italic*** ~~strikethrough~~ `inline code`

## Blockquotes

```markdown
> A blockquote. Great for notes, pull quotes, or attribution.
> Spans multiple lines.
```

> A blockquote. Great for notes, pull quotes, or attribution.  
> Spans multiple lines.

## Unordered list

```markdown
- Item one
- Item two
- Item three
```

- Item one
- Item two
- Item three

## Ordered list

```markdown
1. First step
2. Second step
3. Third step
```

1. First step
2. Second step
3. Third step

## Tables

```markdown
| Name    | Type   | Required | Description      |
|---------|--------|----------|------------------|
| `title` | string | yes      | Site title       |
| `nav`   | array  | yes      | Navigation items |
| `theme` | object | no       | Theme overrides  |
```

| Name    | Type   | Required | Description      |
|---------|--------|----------|------------------|
| `title` | string | yes      | Site title       |
| `nav`   | array  | yes      | Navigation items |
| `theme` | object | no       | Theme overrides  |

## Links

```markdown
[External](https://vite.dev)
[Internal](guide/configuration.md)
```

External links open in a new tab. Internal `.md` links are handled by the router.

[External](https://vite.dev)  
[Internal](guide/configuration.md)

## Images & video

```markdown
![Logo](./assets/logo.svg "Optional caption")
```

![Logo](./docs/assets/logo.svg "Optional caption")

## Horizontal rule

```markdown
***
```

---

## Keyboard keys

```markdown
Press [[Ctrl+S]] to save, [[Ctrl+Z]] to undo, [[Escape]] to cancel.
```

Press [[Ctrl+S]] to save, [[Ctrl+Z]] to undo, [[Escape]] to cancel.