export type RouteHandler = (path: string) => void

let _handler: RouteHandler | null = null
let _landing = 'index.md'
let _errorPage = 'error.md'

async function fileExists(path: string): Promise<boolean> {
  try {
    const response = await fetch(`./docs/${path}`, { method: 'HEAD' })
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
  const has404 = await fileExists(_errorPage)
  const use404 = has404 ? _errorPage : _landing
  const isDirectory = clean.endsWith('/')
  const isExplicitMd = clean.endsWith('.md')
  if (!clean) return _landing
  if (isDirectory) {
    const indexPath = `${clean}index.md`
    const exists = await fileExists(indexPath)
    if (exists) return indexPath
    return use404
  }
  if (isExplicitMd) {
    const exists = await fileExists(clean)
    if (exists) return clean
    return use404
  }
  const direct = `${clean}.md`
  if (await fileExists(direct)) return direct
  const folderIndex = `${clean}/index.md`
  if (await fileExists(folderIndex)) return folderIndex
  return use404
}

export function navigate(path: string): void {
  window.location.hash = `#/${path}`
}

async function dispatch(): Promise<void> {
  if (!_handler) return
  const hash = cleanHash()
  if (!hash) {
    window.location.replace(`/#/${_landing}`)
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