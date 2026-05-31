import type { DocsConfig } from './types.ts'

const CONFIG_PATH = './docs/config.json'

let _cache: DocsConfig | null = null
let _basePath = '/'

export function getBasePath(): string {
  return _basePath
}

export async function loadConfig(): Promise<DocsConfig> {
  if (_cache) return _cache
  const response = await fetch(CONFIG_PATH)
  if (!response.ok) throw new Error(`Cannot load config (${response.status}): ${CONFIG_PATH}`)
  _cache = await response.json() as DocsConfig
  _basePath = (_cache.basePath || '/').replace(/\/$/, '') || '/'
  return _cache
}

export function applyTheme(config: DocsConfig): void {
  const theme = config.theme
  if (!theme) return
  const root = document.documentElement
  const vars: Record<string, string | undefined> = {
    '--accent': theme.accent,
    '--accent-hover': theme.accentHover,
    '--bg': theme.bg,
    '--surface': theme.surface,
    '--font-body': theme.fontBody,
    '--font-mono': theme.fontMono,
  }
  for (const [key, value] of Object.entries(vars)) if (value) root.style.setProperty(key, value)
  if (theme.customCss) {
    const style = document.createElement('style')
    style.id = 'docs-custom-css'
    style.textContent = theme.customCss
    document.head.appendChild(style)
  }
  const logoSrc = config.logo?.image
  if (logoSrc) {
    const existing = document.querySelector<HTMLLinkElement>('link[rel~="icon"]')
    if (existing) {
      existing.href = logoSrc
      existing.type = logoSrc.endsWith('.svg') ? 'image/svg+xml' : 'image/png'
    } else {
      const link = document.createElement('link')
      link.rel = 'icon'
      link.href = logoSrc
      link.type = logoSrc.endsWith('.svg') ? 'image/svg+xml' : 'image/png'
      document.head.appendChild(link)
    }
  }
}