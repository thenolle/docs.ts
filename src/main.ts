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
    try {
      const result = await loadPage(path, config.customRules ?? [])
      if (result.empty) renderEmptyPage(config)
      else renderPage(result.html)
    } catch (error) {
      console.error('Error loading page:', error)
      renderPage(`
        <div class="callout callout-danger">
          <strong>Failed to render page</strong>
          <p><code>${String(error)}</code></p>
        </div>
      `)
    }
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