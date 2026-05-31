export type RouteHandler = (path: string) => void

let _handler: RouteHandler | null = null
let _landing = 'index.md'
let _errorPage = 'error.md'

const BASE_PATH = (() => {
  const pathname = window.location.pathname
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
})()

async function fileExists(path: string): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_PATH}/docs/${path}`, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

function cleanHash(): string {
  return window.location.hash.replace(/^#\/?/, '').trim()
}

function normalize(raw: string): string {
  return raw.replace(/^\/+/, '').trim()
}

export function hrefToPath(href: string): string {
  if (!href) return _landing
  if (href.endsWith('.md')) return href
  if (href.endsWith('/')) return href + 'index.md'
  return href + '.md'
}

async function resolveRoute(raw: string): Promise<string> {
  const clean = normalize(raw)
  const isDirectory = clean.endsWith('/')
  if (isDirectory) {
    const has404 = await fileExists(_errorPage)
    return has404 ? _errorPage : _landing
  }
  const isExplicitMd = clean.endsWith('.md')
  if (isExplicitMd) {
    if (await fileExists(clean)) return clean
    const has404 = await fileExists(_errorPage)
    return has404 ? _errorPage : _landing
  }
  const mdPath = `${clean}.md`
  if (await fileExists(mdPath)) return mdPath
  const has404 = await fileExists(_errorPage)
  return has404 ? _errorPage : _landing
}

export function navigate(path: string): void {
  const clean = path.startsWith('/') ? path.slice(1) : path
  window.location.href = `${BASE_PATH}/#/${clean}`
}

async function dispatch(): Promise<void> {
  if (!_handler) return
  const hash = cleanHash()
  if (!hash) {
    window.location.replace(`${BASE_PATH}/#/${_landing}`)
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