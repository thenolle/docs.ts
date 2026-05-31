import type { DocsConfig, NavEntry } from './types.ts'
import { hrefToPath } from './router.ts'

export function buildShell(config: DocsConfig): void {
  document.title = config.title
  const logoHtml = config.logo?.svg
    ? config.logo.svg
    : config.logo?.image
      ? `<img src='${config.logo.image}' alt='${escapeHtml(config.logo.alt ?? config.title)}' width='28' height='28' />`
      : `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' stroke-linejoin='round' width='28' height='28'><path fill='none' stroke='#3b82f6' stroke-width='4px' transform='translate(-8 -8)' d='m32 12 16 10v20L32 52 16 42V22z'/><path stroke='#60a5fa' stroke-width='4px' stroke-linecap='round' transform='translate(-8 -8)' d='M32 12v40'/><path fill='none' stroke='#60a5fa' stroke-width='4px' stroke-linecap='round' transform='translate(-8 -8)' d='m16 22 16 10 16-10M16 42l16-10 16 10'/><circle fill='#e0f2fe' cx='32' cy='32' r='5' transform='translate(-8 -8)'/></svg>`

  document.body.innerHTML = `
    <a href='#main' class='skip-link'>Skip to content</a>
    ${config.scrollProgress !== false ? `<div class='scroll-progress' aria-hidden='true'><div class='scroll-progress-bar' id='scrollBar'></div></div>` : ''}
    <nav class='sidebar' id='sidebar' aria-label='Documentation navigation'>
      <div class='sidebar-header'>
        ${logoHtml}
        <span class='logo-text'>${escapeHtml(config.title)}</span>
        <button class='sidebar-close' id='sidebarClose' aria-label='Close sidebar'>
          <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
            <line x1='18' y1='6' x2='6' y2='18'/><line x1='6' y1='6' x2='18' y2='18'/>
          </svg>
        </button>
      </div>
      <div class='sidebar-search'><input type='search' id='navSearch' placeholder='Search…' aria-label='Search documentation' autocomplete='off' /></div>
      <ul class='nav-list' role='list' id='navList'>${buildNavHtml(config.nav)}</ul>
    </nav>
    <header class='topbar'>
      <button class='menu-toggle' id='menuToggle' aria-label='Open navigation' aria-expanded='false'>
        <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
          <line x1='3' y1='6' x2='21' y2='6'/>
          <line x1='3' y1='12' x2='21' y2='12'/>
          <line x1='3' y1='18' x2='21' y2='18'/>
        </svg>
      </button>
      <span class='topbar-title'>${escapeHtml(config.title)}</span>
      <div class='topbar-actions'>
        ${config.version ? `<span class='version-badge'>${escapeHtml(config.version)}</span>` : ''}
        ${config.themeToggle !== false ? `
        <button class='theme-toggle' id='themeToggle' aria-label='Toggle theme'>
          <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
            <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'/>
          </svg>
        </button>` : ''}
      </div>
    </header>
    <div class='sidebar-overlay' id='sidebarOverlay'></div>
    <main class='main' id='main' tabindex='-1'>
      <div class='doc-content md-content' id='docContent'>
        <div class='page-loading'>
          <svg class='spinner' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
            <circle cx='12' cy='12' r='10' stroke-opacity='0.25'/>
            <path d='M22 12a10 10 0 0 1-10 10' stroke-linecap='round'/>
          </svg>
        </div>
      </div>
    </main>`

  bindInteractions(config)
}

function buildNavHtml(nav: NavEntry[]): string {
  return nav.map(entry => {
    if ('group' in entry) return `<li class='nav-group-label'>${escapeHtml(entry.group)}</li>` + entry.items.map(navItemHtml).join('')
    return navItemHtml(entry)
  }).join('')
}

function navItemHtml(item: { label: string; href: string }): string {
  const path = hrefToPath(item.href)
  return `<li><a href='#${path}' class='nav-link' data-path='${path}'>${escapeHtml(item.label)}</a></li>`
}

function escapeHtml(input: string): string {
  return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function bindInteractions(config: DocsConfig): void {
  const sidebar = document.getElementById('sidebar')!
  const overlay = document.getElementById('sidebarOverlay')!
  const menuBtn = document.getElementById('menuToggle')!
  const closeBtn = document.getElementById('sidebarClose')!
  const search = document.getElementById('navSearch') as HTMLInputElement

  const openSidebar = (): void => {
    sidebar.classList.add('open')
    overlay.classList.add('open')
    menuBtn.setAttribute('aria-expanded', 'true')
  }

  const closeSidebar = (): void => {
    sidebar.classList.remove('open')
    overlay.classList.remove('open')
    menuBtn.setAttribute('aria-expanded', 'false')
  }

  menuBtn.addEventListener('click', openSidebar)
  closeBtn.addEventListener('click', closeSidebar)
  overlay.addEventListener('click', closeSidebar)

  document.getElementById('navList')?.addEventListener('click', event => {
    if ((event.target as HTMLElement).classList.contains('nav-link')) {
      closeSidebar()
      search.value = ''
      document.querySelectorAll<HTMLElement>('.nav-list li').forEach(li => { li.style.display = '' })
    }
  })

  const themeBtn = document.getElementById('themeToggle')
  if (themeBtn && config.themeToggle !== false) {
    let current = document.documentElement.getAttribute('data-theme') ?? (config.defaultTheme ?? 'dark')
    const moonSvg = `<svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'/></svg>`
    const sunSvg = `<svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='5'/><path d='M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42'/></svg>`
    const syncIcon = (): void => { themeBtn.innerHTML = current === 'dark' ? sunSvg : moonSvg }
    syncIcon()
    themeBtn.addEventListener('click', () => {
      current = current === 'dark' ? 'light' : 'dark'
      document.documentElement.setAttribute('data-theme', current)
      syncIcon()
    })
  }

  if (config.scrollProgress !== false) {
    const bar = document.getElementById('scrollBar')
    if (bar) {
      window.addEventListener('scroll', () => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        bar.style.width = max > 0 ? `${(window.scrollY / max) * 100}%` : '0%'
      }, { passive: true })
    }
  }

  search.addEventListener('input', () => {
    const q = search.value.toLowerCase().trim()
    document.querySelectorAll<HTMLElement>('.nav-list li').forEach(li => {
      if (li.classList.contains('nav-group-label')) { li.style.display = ''; return }
      const label = li.querySelector('.nav-link')?.textContent?.toLowerCase() ?? ''
      li.style.display = !q || label.includes(q) ? '' : 'none'
    })
  })
}

export function setActiveNav(path: string): void {
  document.querySelectorAll<HTMLAnchorElement>('.nav-link').forEach(a => {
    const active = a.dataset['path'] === path
    a.classList.toggle('active', active)
    if (active) a.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  })
}

export function renderPage(html: string): void {
  const element = document.getElementById('docContent')
  if (!element) return
  element.innerHTML = html

  element.querySelectorAll<HTMLTableElement>('table').forEach(t => {
    if (!t.closest('.table-wrap')) {
      const wrap = document.createElement('div')
      wrap.className = 'table-wrap'
      t.parentNode?.insertBefore(wrap, t)
      wrap.appendChild(t)
    }
  })

  element.querySelectorAll<HTMLButtonElement>('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const code = decodeURIComponent(btn.dataset['code'] ?? '')
      try {
        await navigator.clipboard.writeText(code)
      } catch {
        const ta = document.createElement('textarea')
        ta.value = code
        ta.style.cssText = 'position:fixed;opacity:0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      btn.textContent = 'copied!'
      btn.classList.add('copied')
      setTimeout(() => { btn.textContent = 'copy'; btn.classList.remove('copied') }, 2000)
    })
  })

  element.querySelectorAll<HTMLButtonElement>('.spoiler-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const spoiler = btn.closest<HTMLElement>('.spoiler')
      const open = spoiler?.classList.toggle('open') ?? false
      btn.setAttribute('aria-expanded', String(open))
    })
  })

  window.scrollTo({ top: 0 })
}

export function renderEmptyPage(config: DocsConfig): void {
  renderPage(`
    <div class='empty-doc'>
      <div class='empty-doc-icon'>
        <svg width='56' height='56' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.2'>
          <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/>
          <polyline points='14 2 14 8 20 8'/>
          <line x1='16' y1='13' x2='8' y2='13'/>
          <line x1='16' y1='17' x2='8' y2='17'/>
          <polyline points='10 9 9 9 8 9'/>
        </svg>
      </div>
      <h1>No documentation yet</h1>
      <p>Add <code>.md</code> files to <code>public/docs/</code> and reference them in <code>public/docs/config.json</code> under the <code>nav</code> array.</p>
      <div class='empty-doc-steps'>
        <div class='empty-step'>
          <span class='empty-step-num'>1</span>
          <div><strong>Create a page</strong><span>Add <code>public/docs/index.md</code></span></div>
        </div>
        <div class='empty-step'>
          <span class='empty-step-num'>2</span>
          <div><strong>Set the landing page</strong><span>Set <code>'landing': 'index.md'</code> in <code>config.json</code></span></div>
        </div>
        <div class='empty-step'>
          <span class='empty-step-num'>3</span>
          <div><strong>Build your nav</strong><span>Populate the <code>'nav'</code> array with groups and links</span></div>
        </div>
      </div>
      <p class='empty-doc-subtitle'>
        <strong>${escapeHtml(config.title)}</strong>${config.version ? ` &mdash; ${escapeHtml(config.version)}` : ''}
      </p>
    </div>
  `)
}