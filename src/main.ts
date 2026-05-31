import { loadConfig, applyTheme } from './lib/config.ts'
import { buildShell, setActiveNav, renderPage, renderEmptyPage } from './lib/ui.ts'
import { initRouter } from './lib/router.ts'
import { loadPage } from './lib/loader.ts'

async function boot(): Promise<void> {
  const config = await loadConfig()
  document.documentElement.setAttribute('data-theme', config.defaultTheme ?? 'dark')
  applyTheme(config)
  buildShell(config)
  const landing = config.landing ?? 'index.md'
  initRouter(landing, async (path: string) => {
    setActiveNav(path)
    let result
    try {
      result = await loadPage(path, config.customRules ?? [])
    } catch {
      result = { html: '', status: 'error' as const }
    }
    if (result.status === 'ok') {
      renderPage(result.html)
      return
    }
    if (result.status === 'not_found') {
      const error = await loadPage(config.landing ?? 'index.md')
      if (error.status === 'ok') {
        renderPage(`<div class="callout callout-danger"><strong>404 - Page not found</strong><p>This page does not exist.</p></div>`)
        return
      }
      renderEmptyPage(config)
      return
    }
    renderPage(`<div class="callout callout-danger"><strong>Failed to load page</strong></div>`)
  })
}

boot().catch(error => {
  console.error('Error booting documentation site:', error)
  document.body.innerHTML = `
    <div style="padding:2rem;font-family:monospace;color:#dd6974">
      <strong>Failed to load docs config</strong><br>
      <code>${String(error)}</code><br><br>
      Ensure <code>public/docs/config.json</code> exists.
    </div>
  `
})