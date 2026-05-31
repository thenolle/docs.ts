export function resolvePath(importPath: string, sourcePath: string): string {
  if (importPath.startsWith('/')) return importPath
  const base = sourcePath.replace(/[^/]+$/, '')
  const parts = (base + importPath).split('/')
  const resolved: string[] = []
  for (const part of parts) {
    if (part === '..') resolved.pop()
    else if (part !== '.') resolved.push(part)
  }
  return resolved.join('/')
}

export async function fetchImports(source: string, sourcePath: string): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  const matches = [...source.matchAll(/^!!import\[([^\]]+)\]/gm)]
  if (!matches.length) return map
  await Promise.all(
    matches.map(async m => {
      const raw = m[1]
      if (map.has(raw)) return
      const resolved = resolvePath(raw, sourcePath)
      try {
        const response = await fetch(resolved)
        map.set(raw, response.ok ? await response.text() : '')
      } catch {
        map.set(raw, '')
      }
    })
  )
  return map
}