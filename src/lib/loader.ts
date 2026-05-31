import { parse } from './markdown.ts'
import { fetchImports } from './importer.ts'
import type { CustomMarkdownRule } from './types.ts'

const DOCS_BASE = './docs/'

export interface LoadResult {
  html: string
  empty: boolean
}

export async function loadPage(
  path: string,
  customRules: CustomMarkdownRule[] = []
): Promise<LoadResult> {
  const url = /^https?:\/\//.test(path) ? path : DOCS_BASE + path

  let source: string
  try {
    const res = await fetch(url)
    if (!res.ok) return { html: '', empty: true }
    source = await res.text()
  } catch {
    return { html: '', empty: true }
  }

  if (!source.trim()) return { html: '', empty: true }

  try {
    const imported = await fetchImports(source, url)
    const html = parse(source, imported, customRules)
    return { html: `<div class="doc-section">${html}</div>`, empty: false }
  } catch {
    return { html: '', empty: true }
  }
}