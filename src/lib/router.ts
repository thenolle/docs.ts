export type RouteHandler = (path: string) => void

let _handler: RouteHandler | null = null
let _landing = 'index.md'

export function hrefToPath(href: string): string {
  if (href.endsWith('.md')) return href
  if (href.endsWith('/')) return href + 'index.md'
  return href + '.md'
}

export function navigate(path: string): void {
  window.location.hash = path
}

async function tryErrorPage(): Promise<boolean> {
  if (!_handler) return false
  try {
    const res = await fetch('./docs/error.md', { method: 'HEAD' })
    if (res.ok) { _handler('error.md'); return true }
  } catch { }
  return false
}

async function dispatch(): Promise<void> {
  if (!_handler) return

  const hash = window.location.hash.replace(/^#\/?/, '').trim()
  const pathname = window.location.pathname

  if (hash) {
    if (hash.endsWith('.md')) {
      _handler(hash)
      return
    }
    const found = await tryErrorPage()
    if (!found) _handler(_landing)
    return
  }

  if (pathname && pathname !== '/' && pathname !== '/index.html') {
    const cleaned = pathname.replace(/^\//, '')
    if (cleaned.endsWith('.md')) {
      window.history.replaceState(null, '', `/#${cleaned}`)
      _handler(cleaned)
      return
    }
    const found = await tryErrorPage()
    if (!found) _handler(_landing)
    return
  }

  _handler(_landing)
}

export function initRouter(landing: string, handler: RouteHandler): void {
  _landing = landing
  _handler = handler
  window.addEventListener('popstate', () => { void dispatch() })
  window.addEventListener('hashchange', () => { void dispatch() })
  void dispatch()
}