import { parse } from './markdown.ts'
import { fetchImports } from './importer.ts'
import type { CustomMarkdownRule } from './types.ts'

const DOCS_BASE = './docs/'

export interface LoadResult {
  html: string
  status: 'ok' | 'not_found' | 'error'
}

export async function loadPage(path: string, customRules: CustomMarkdownRule[] = []): Promise<LoadResult> {
  const url = /^https?:\/\//.test(path) ? path : DOCS_BASE + path
  let response: Response
  try {
    response = await fetch(url)
  } catch {
    return { html: '', status: 'error' }
  }
  if (response.status === 404) return { html: '', status: 'not_found' }
  if (!response.ok) return { html: '', status: 'error' }
  const source = await response.text()
  if (!source.trim()) return { html: '', status: 'not_found' }
  try {
    const imported = await fetchImports(source, url)
    const html = parse(source, imported, customRules)
    return { html: `<div class="doc-section">${html}</div>`, status: 'ok' }
  } catch {
    return { html: '', status: 'error' }
  }
}