# Custom Elements

## Chips

Inline tags for versions, statuses, or any short metadata.

```markdown
::chip[typescript]
::chip[stable]{green}
::chip[deprecated]{red}
::chip[beta]{yellow}
```

::chip[typescript]  ::chip[stable]{green}  ::chip[deprecated]{red}  ::chip[beta]{yellow}

Available color modifiers: `green`, `red`, `yellow`. Omit `{}` for the default accent color.

## Callouts

```markdown
:::info[Note]
Content here.
:::

:::warn[Warning]
Content here.
:::

:::danger[Danger]
Content here.
:::

:::success[Done]
Content here.
:::
```

:::info[Note]
This is an **info** callout. Use _italic_, `code`, [[kbd]] shortcuts, and ==highlights== inside.
:::

:::warn[Warning]
Double-check before deploying. The change may be ==irreversible==.
:::

:::danger[Danger]
This will permanently delete data. There is no undo.
:::

:::success[Done]
All steps completed. You're ready to ship! ::chip[v1.0.0]{green}
:::

## Spoilers

```markdown
:::spoiler[Click to reveal]
Hidden content - any markdown valid here.
:::
```

:::spoiler[Show full TypeScript interface]
```ts
export interface DocsConfig {
  title: string
  description?: string
  version?: string
  logo?: { svg?: string; image?: string; alt?: string }
  nav: NavEntry[]
  landing?: string
  theme?: DocTheme
  customRules?: CustomMarkdownRule[]
  scrollProgress?: boolean
  themeToggle?: boolean
  defaultTheme?: 'dark' | 'light'
}
```
:::

:::spoiler[Show the answer to life, the universe, and everything]
The answer is **42**.

You can put any markdown inside a spoiler, including:

- Lists with `code`
- Tables
- Callouts

:::info[Nested callout]
Yes, callouts nested inside spoilers work.
:::
:::

## Custom config rules

Active rules in this demo's `config.json`:

| Syntax | Output | Rule ID |
|--------|--------|---------|
| `==text==` | ==highlighted== | `highlight-term` |
| `::v[1.2.3]` | ::v[1.2.3] | `version-tag` |
| `::since[v0.3.0]` | ::since[v0.3.0] | `since-tag` |

See [Configuration](guide/configuration.md) to add your own.