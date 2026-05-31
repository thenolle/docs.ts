import { getBasePath } from './config'

export type RouteHandler = (path: string) => void

let _handler: RouteHandler | null = null
let _landing = 'index.md'
let _errorPage = 'error.md'

function base(): string {
  const basepath = getBasePath()
  console.debug('Base path:', basepath)
  return basepath === '/' ? '' : basepath
}

function cleanHash(): string {
  return window.location.hash.replace(/^#\/?/, '').trim()
}

function normalize(raw: string): string {
  return raw.replace(/^\/+/, '').trim()
}

async function fileExists(path: string): Promise<boolean> {
  try {
    const url = `${base()}/docs/${path}`
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

export function hrefToPath(href: string): string {
  if (!href) return _landing
  if (href.endsWith('.md')) return href
  if (href.endsWith('/')) return href + 'index.md'
  return href + '.md'
}

async function resolveRoute(raw: string): Promise<string> {
  const clean = normalize(raw)
  if (!clean) return _landing
  if (clean.endsWith('/')) return (await fileExists(_errorPage)) ? _errorPage : _landing
  if (clean.endsWith('.md')) {
    if (await fileExists(clean)) return clean
    return (await fileExists(_errorPage)) ? _errorPage : _landing
  }
  const md = `${clean}.md`
  if (await fileExists(md)) return md
  return (await fileExists(_errorPage)) ? _errorPage : _landing
}

export function navigate(path: string): void {
  const clean = path.startsWith('/') ? path.slice(1) : path
  const prefix = base()
  window.location.href = `${prefix}/#/${clean}`
}

async function dispatch(): Promise<void> {
  if (!_handler) return
  const hash = cleanHash()
  if (!hash) {
    const prefix = base()
    window.location.replace(`${prefix}/#/${_landing}`)
    _handler(_landing)
    return
  }
  const resolved = await resolveRoute(hash)
  _handler(resolved)
}

export function initRouter(landing: string, handler: RouteHandler): void {
  _landing = landing
  _handler = handler
  window.addEventListener('hashchange', () => void dispatch())
  window.addEventListener('popstate', () => void dispatch())
  void dispatch()
}