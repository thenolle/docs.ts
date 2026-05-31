import type { CustomMarkdownRule } from './types.ts'

export function slugify(text: string): string {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function singlePass(
  raw: string,
  re: RegExp,
  render: (match: RegExpExecArray) => string
): string {
  const out: string[] = []
  let last = 0
  for (const m of raw.matchAll(re)) {
    if (m.index > last) out.push(esc(raw.slice(last, m.index)))
    out.push(render(m))
    last = m.index + m[0].length
  }
  if (last < raw.length) out.push(esc(raw.slice(last)))
  return out.join('')
}

function hlJsTs(raw: string): string {
  const re =
    /(?<cm>\/\*[\s\S]*?\*\/|\/\/[^\n]*)|(?<str>`(?:[^`\\]|\\.)*`|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(?<kw>\b(?:import|export|from|as|default|const|let|var|function|class|extends|implements|interface|type|enum|return|if|else|for|while|do|switch|case|break|continue|throw|try|catch|finally|new|typeof|instanceof|in|of|async|await|yield|void|null|undefined|true|false|this|super|static|public|private|protected|readonly|abstract|declare|namespace|module)\b)|(?<num>\b\d+\.?\d*\b)|(?<fn>[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\())/g
  return singlePass(raw, re, m => {
    const g = m.groups!
    if (g['cm']  !== undefined) return `<span class="tok-cm">${esc(g['cm'])}</span>`
    if (g['str'] !== undefined) return `<span class="tok-str">${esc(g['str'])}</span>`
    if (g['kw']  !== undefined) return `<span class="tok-kw">${esc(g['kw'])}</span>`
    if (g['num'] !== undefined) return `<span class="tok-num">${esc(g['num'])}</span>`
    if (g['fn']  !== undefined) return `<span class="tok-fn">${esc(g['fn'])}</span>`
    return esc(m[0])
  })
}

function hlJson(raw: string): string {
  const re =
    /(?<key>"(?:[^"\\]|\\.)*"(?=\s*:))|(?<colval>:\s*"(?:[^"\\]|\\.)*")|(?<colkw>:\s*(?:true|false|null)(?!\w))|(?<kw>\b(?:true|false|null)\b)|(?<num>-?\d+\.?\d*(?:[eE][+-]?\d+)?)/g
  return singlePass(raw, re, m => {
    const g = m.groups!
    if (g['key'] !== undefined) return `<span class="tok-key">${esc(g['key'])}</span>`
    if (g['colval'] !== undefined) {
      const cv = g['colval']
      const sep = cv.match(/^(:\s*)/)![1]
      return `${esc(sep)}<span class="tok-val">${esc(cv.slice(sep.length))}</span>`
    }
    if (g['colkw'] !== undefined) {
      const ck = g['colkw']
      const sep = ck.match(/^(:\s*)/)![1]
      return `${esc(sep)}<span class="tok-kw">${esc(ck.slice(sep.length))}</span>`
    }
    if (g['kw']  !== undefined) return `<span class="tok-kw">${esc(g['kw'])}</span>`
    if (g['num'] !== undefined) return `<span class="tok-num">${esc(g['num'])}</span>`
    return esc(m[0])
  })
}

function hlCss(raw: string): string {
  const re =
    /(?<cm>\/\*[\s\S]*?\*\/)|(?<col>#[0-9a-fA-F]{3,8}\b)|(?<str>'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(?<atr>[a-zA-Z-]+(?=\s*:))/g
  return singlePass(raw, re, m => {
    const g = m.groups!
    if (g['cm']  !== undefined) return `<span class="tok-cm">${esc(g['cm'])}</span>`
    if (g['col'] !== undefined) return `<span class="tok-num">${esc(g['col'])}</span>`
    if (g['str'] !== undefined) return `<span class="tok-str">${esc(g['str'])}</span>`
    if (g['atr'] !== undefined) return `<span class="tok-atr">${esc(g['atr'])}</span>`
    return esc(m[0])
  })
}

function hlHtml(raw: string): string {
  const re = /(?<cm><!--[\s\S]*?-->)|(?<tag><\/?[a-zA-Z][a-zA-Z0-9-]*(?:\s[^>]*)?\/?>)/g
  return singlePass(raw, re, m => {
    const g = m.groups!
    if (g['cm'] !== undefined) return `<span class="tok-cm">${esc(g['cm'])}</span>`
    if (g['tag'] !== undefined) {
      const full = g['tag']
      const parts = full.match(/^(<\/?)([ a-zA-Z][a-zA-Z0-9-]*)([\s\S]*?)(\s*\/?>)$/)
      if (!parts) return esc(full)
      const [, open, name, attrRaw, close] = parts
      const attrs = attrRaw.replace(
        /([a-zA-Z][a-zA-Z0-9-]*)(\s*=\s*)("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[^\s>]+)/g,
        (_a: string, n: string, eq: string, v: string) =>
          `<span class="tok-atr">${esc(n)}</span>${esc(eq)}<span class="tok-val">${esc(v)}</span>`
      )
      return (
        `<span class="tok-pun">${esc(open)}</span>` +
        `<span class="tok-tag">${esc(name)}</span>` +
        attrs +
        `<span class="tok-pun">${esc(close)}</span>`
      )
    }
    return esc(m[0])
  })
}

function hlBash(raw: string): string {
  const re =
    /(?<cm>#[^\n]*)|(?<str>'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(?<kw>\b(?:echo|cd|ls|mkdir|rm|cp|mv|cat|grep|sed|awk|curl|wget|npm|npx|pnpm|yarn|git|node|deno|bun|chmod|export|source|if|then|else|fi|for|do|done|while|case|esac|return)\b)/g
  return singlePass(raw, re, m => {
    const g = m.groups!
    if (g['cm']  !== undefined) return `<span class="tok-cm">${esc(g['cm'])}</span>`
    if (g['str'] !== undefined) return `<span class="tok-str">${esc(g['str'])}</span>`
    if (g['kw']  !== undefined) return `<span class="tok-kw">${esc(g['kw'])}</span>`
    return esc(m[0])
  })
}

function highlight(raw: string, lang: string): string {
  switch (lang.toLowerCase()) {
    case 'ts': case 'typescript': case 'js': case 'javascript': return hlJsTs(raw)
    case 'json': return hlJson(raw)
    case 'css': case 'scss': return hlCss(raw)
    case 'html': case 'xml': case 'svg': return hlHtml(raw)
    case 'bash': case 'sh': case 'shell': case 'zsh': return hlBash(raw)
    default: return esc(raw)
  }
}

function renderInline(text: string): string {
  let s = text
  s = s.replace(/`([^`\n]+)`/g, (_m, c: string) => `<code>${esc(c)}</code>`)
  s = s.replace(/\*\*\*(.+?)\*\*\*/g, (_m, t: string) => `<strong><em>${t}</em></strong>`)
  s = s.replace(/\*\*(.+?)\*\*/g, (_m, t: string) => `<strong>${t}</strong>`)
  s = s.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, (_m, t: string) => `<em>${t}</em>`)
  s = s.replace(/__(.+?)__/g, (_m, t: string) => `<strong>${t}</strong>`)
  s = s.replace(/_([^_\n]+)_/g, (_m, t: string) => `<em>${t}</em>`)
  s = s.replace(/~~(.+?)~~/g, (_m, t: string) => `<s>${t}</s>`)
  s = s.replace(/!\[([^\]]*)\]\(([^)"]+)(?:\s+"([^"]*)")?\)/g, (_m, alt: string, src: string, cap: string) => {
    const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(src)
    const fig = cap ? `<figcaption>${esc(cap)}</figcaption>` : ''
    if (isVideo) return `<figure class="md-media"><video src="${esc(src)}" controls preload="metadata" title="${esc(alt)}"></video>${fig}</figure>`
    return `<figure class="md-media"><img src="${esc(src)}" alt="${esc(alt)}" loading="lazy">${fig}</figure>`
  })
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label: string, href: string) => {
    if (href.endsWith('.md') && !/^https?:\/\//.test(href)) {
      return `<a href="#${href}">${label}</a>`
    }
    const ext = /^https?:\/\//.test(href) ? ' target="_blank" rel="noopener noreferrer"' : ''
    return `<a href="${esc(href)}"${ext}>${label}</a>`
  })
  s = s.replace(/::chip\[([^\]]+)\](?:\{([^}]+)\})?/g, (_m, label: string, color: string) =>
    `<span class="chip chip-sm${color ? ` chip-${color}` : ''}">${esc(label)}</span>`
  )
  s = s.replace(/\[\[([^\]]+)\]\]/g, (_m, k: string) => `<kbd>${esc(k)}</kbd>`)
  return s
}

type Block =
  | { type: 'heading'; level: number; text: string; id: string }
  | { type: 'hr' }
  | { type: 'pre'; lang: string; code: string }
  | { type: 'blockquote'; lines: string[] }
  | { type: 'list'; ordered: boolean; lines: string[] }
  | { type: 'table'; header: string[]; aligns: string[]; rows: string[][] }
  | { type: 'callout'; variant: string; title: string; lines: string[] }
  | { type: 'spoiler'; label: string; lines: string[] }
  | { type: 'import'; path: string }
  | { type: 'html'; raw: string }
  | { type: 'paragraph'; lines: string[] }

function consumeContainer(lines: string[], start: number): { inner: string[]; end: number } {
  const inner: string[] = []
  let depth = 1
  let i = start
  while (i < lines.length) {
    const trimmed = lines[i].trim()
    if (/^:::(info|warn(?:ing)?|danger|error|success|note|tip|spoiler)/i.test(trimmed)) {
      depth++
      inner.push(lines[i])
    } else if (trimmed === ':::') {
      depth--
      if (depth === 0) { i++; break }
      inner.push(lines[i])
    } else {
      inner.push(lines[i])
    }
    i++
  }
  return { inner, end: i }
}

function parseTableRow(line: string): string[] {
  return line.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim())
}

function parseTableAligns(sep: string): string[] {
  return sep.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => {
    const t = c.trim()
    if (t.startsWith(':') && t.endsWith(':')) return 'center'
    if (t.endsWith(':')) return 'right'
    return 'left'
  })
}

function tokenise(source: string): Block[] {
  const blocks: Block[] = []
  const lines = source.split('\n')
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) { i++; continue }

    const fenceM = line.match(/^(`{3,}|~{3,})([\w+-]*)/)
    if (fenceM) {
      const fence = fenceM[1]
      const lang = fenceM[2] ?? ''
      const code: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith(fence)) { code.push(lines[i]); i++ }
      i++ // skip closing fence
      blocks.push({ type: 'pre', lang, code: code.join('\n') })
      continue
    }

    const calloutM = line.trim().match(/^:::(info|warn(?:ing)?|danger|error|success|note|tip)(?:\[([^\]]*)\])?/i)
    if (calloutM) {
      const raw = calloutM[1].toLowerCase()
      const variant = raw === 'warning' ? 'warn' : raw === 'error' ? 'danger' : raw === 'note' ? 'info' : raw === 'tip' ? 'success' : raw
      const title = calloutM[2] ?? (variant.charAt(0).toUpperCase() + variant.slice(1))
      i++
      const { inner, end } = consumeContainer(lines, i)
      i = end
      blocks.push({ type: 'callout', variant, title, lines: inner })
      continue
    }

    const spoilerM = line.trim().match(/^:::spoiler(?:\[([^\]]*)\])?/i)
    if (spoilerM) {
      const label = spoilerM[1] ?? 'Show more'
      i++
      const { inner, end } = consumeContainer(lines, i)
      i = end
      blocks.push({ type: 'spoiler', label, lines: inner })
      continue
    }

    const importM = line.match(/^!!import\[([^\]]+)\]/)
    if (importM) { blocks.push({ type: 'import', path: importM[1] }); i++; continue }

    const headingM = line.match(/^(#{1,6})\s+(.+)/)
    if (headingM) {
      const text = headingM[2].trim()
      blocks.push({ type: 'heading', level: headingM[1].length, text, id: slugify(text) })
      i++; continue
    }

    if (line.match(/^[-*_]{3,}\s*$/)) { blocks.push({ type: 'hr' }); i++; continue }

    if (line.startsWith('>')) {
      const bq: string[] = []
      while (i < lines.length && lines[i].startsWith('>')) { bq.push(lines[i].replace(/^>\s?/, '')); i++ }
      blocks.push({ type: 'blockquote', lines: bq })
      continue
    }

    if (line.includes('|') && lines[i + 1]?.match(/^\|?[\s|:-]+\|?$/)) {
      const header = parseTableRow(lines[i])
      const aligns = parseTableAligns(lines[i + 1])
      i += 2
      const rows: string[][] = []
      while (i < lines.length && lines[i].includes('|')) { rows.push(parseTableRow(lines[i])); i++ }
      blocks.push({ type: 'table', header, aligns, rows })
      continue
    }

    if (line.match(/^\s*[-*+]\s/)) {
      const lst: string[] = []
      while (i < lines.length && lines[i].match(/^\s*[-*+]\s/)) { lst.push(lines[i]); i++ }
      blocks.push({ type: 'list', ordered: false, lines: lst })
      continue
    }

    if (line.match(/^\d+\.\s/)) {
      const lst: string[] = []
      while (i < lines.length && lines[i].match(/^\d+\.\s/)) { lst.push(lines[i]); i++ }
      blocks.push({ type: 'list', ordered: true, lines: lst })
      continue
    }

    if (line.match(/^<[a-zA-Z]/)) {
      const html: string[] = []
      while (i < lines.length && lines[i].trim() !== '') { html.push(lines[i]); i++ }
      blocks.push({ type: 'html', raw: html.join('\n') })
      continue
    }

    const para: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].match(/^#{1,6}\s/) &&
      !lines[i].match(/^(`{3,}|~{3,})/) &&
      !lines[i].trim().startsWith(':::') &&
      !lines[i].startsWith('!!import') &&
      !lines[i].startsWith('>') &&
      !lines[i].match(/^[-*_]{3,}\s*$/) &&
      !lines[i].match(/^\s*[-*+]\s/) &&
      !lines[i].match(/^\d+\.\s/)
    ) { para.push(lines[i]); i++ }
    if (para.length) blocks.push({ type: 'paragraph', lines: para })
  }

  return blocks
}

function renderBlock(block: Block, imports: Map<string, string>): string {
  switch (block.type) {
    case 'heading':
      return `<h${block.level} id="${block.id}">${renderInline(block.text)}</h${block.level}>`

    case 'hr':
      return '<hr>'

    case 'pre': {
      const raw = block.code
      const hl = highlight(raw, block.lang)
      const badge = block.lang ? `<span class="code-lang">${esc(block.lang)}</span>` : ''
      const copy = `<button class="copy-btn" data-code="${encodeURIComponent(raw)}" aria-label="Copy code">copy</button>`
      return `<pre>${badge}${copy}<code>${hl}</code></pre>`
    }

    case 'blockquote':
      return `<blockquote>${block.lines.map(l => `<p>${renderInline(l)}</p>`).join('\n')}</blockquote>`

    case 'list': {
      const tag = block.ordered ? 'ol' : 'ul'
      const items = block.lines
        .map(l => `<li>${renderInline(l.replace(/^\s*(?:[-*+]|\d+\.)\s+/, ''))}</li>`)
        .join('\n')
      return `<${tag}>${items}</${tag}>`
    }

    case 'table': {
      const cols = block.header.length
      const th = block.header.map((c, ci) =>
        `<th style="text-align:${block.aligns[ci] ?? 'left'}">${renderInline(c)}</th>`
      ).join('')
      const trs = block.rows
        .filter(r => r.length > 0)
        .map(r => {
          const cells = Array.from({ length: cols }, (_, ci) =>
            `<td style="text-align:${block.aligns[ci] ?? 'left'}">${renderInline(r[ci] ?? '')}</td>`
          ).join('')
          return `<tr>${cells}</tr>`
        }).join('\n')
      return `<div class="table-wrap"><table><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table></div>`
    }

    case 'callout': {
      const inner = renderBlocks(tokenise(block.lines.join('\n')), imports)
      return `<div class="callout callout-${block.variant}"><strong>${esc(block.title)}</strong>${inner}</div>`
    }

    case 'spoiler': {
      const inner = renderBlocks(tokenise(block.lines.join('\n')), imports)
      return `<div class="spoiler"><button class="spoiler-toggle" aria-expanded="false"><svg class="spoiler-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>${esc(block.label)}</button><div class="spoiler-body">${inner}</div></div>`
    }

    case 'import': {
      const content = imports.get(block.path) ?? ''
      if (!content) return `<div class="callout callout-warn"><strong>Import failed</strong><p>Could not load <code>${esc(block.path)}</code></p></div>`
      const ext = block.path.split('.').pop()?.toLowerCase() ?? ''
      if (ext === 'svg') return `<div class="md-svg">${content}</div>`
      if (ext === 'json') return `<div class="md-json"><pre><code>${hlJson(content)}</code></pre></div>`
      return `<pre><span class="code-lang">${esc(ext)}</span><code>${highlight(content, ext)}</code></pre>`
    }

    case 'html':
      return block.raw

    case 'paragraph':
      return `<p>${renderInline(block.lines.join('<br>'))}</p>`
  }
}

function renderBlocks(blocks: Block[], imports: Map<string, string>): string {
  return blocks.map(b => renderBlock(b, imports)).join('\n')
}

export function parse(
  source: string,
  imported: Map<string, string> = new Map(),
  customRules: CustomMarkdownRule[] = []
): string {
  let html = renderBlocks(tokenise(source), imported)
  for (const rule of customRules) {
    html = html.replace(new RegExp(rule.pattern, rule.flags ?? 'g'), rule.replacement)
  }
  return html
}

export function extractHeadings(source: string): Array<{ level: number; text: string; id: string }> {
  return source.split('\n')
    .filter(l => /^#{1,6}\s/.test(l))
    .map(l => {
      const m = l.match(/^(#{1,6})\s+(.+)/)!
      const text = m[2].trim()
      return { level: m[1].length, text, id: slugify(text) }
    })
}