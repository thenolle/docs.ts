export interface DocTheme {
  accent?: string
  accentHover?: string
  bg?: string
  surface?: string
  fontBody?: string
  fontMono?: string
  customCss?: string
}

export interface NavItem {
  label: string
  href: string
}

export interface NavGroup {
  group: string
  items: NavItem[]
}

export type NavEntry = NavItem | NavGroup

export interface CustomMarkdownRule {
  id: string
  pattern: string
  flags?: string
  replacement: string
}

export interface DocsConfig {
  title: string
  description?: string
  version?: string
  logo?: {
    svg?: string
    image?: string
    alt?: string
  }
  nav: NavEntry[]
  landing?: string
  basePath?: string
  theme?: DocTheme
  customRules?: CustomMarkdownRule[]
  scrollProgress?: boolean
  themeToggle?: boolean
  defaultTheme?: 'dark' | 'light'
}