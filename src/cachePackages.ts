import fs from 'fs'
import path from 'path'
import temp from 'temp'

const CACHE_FILE = '.find-installed-packages.cache'
const filepath = path.join(temp.dir, CACHE_FILE)

export type Cache = Record<string, string[]>

export function getCacheKey(keywords: string[], cwd: string): string {
  return JSON.stringify({ cwd: path.resolve(cwd), keywords: keywords.sort() })
}

export function getCachedPackages(key: string, lastCtimeMs: number): string[] | undefined {
  const cache = loadCache()
  const entry = cache[key]
  if (entry) {
    // istanbul ignore next
    if (entry.ctimeMs < lastCtimeMs) {
      delete cache[key]
      saveCache(cache)
      return undefined
    }
    return entry.packages
  }

  return undefined
}

export function setCachedPackages(key: string, ctimeMs: number, packages: string[]) {
  const cache = loadCache()
  cache[key] = { ctimeMs, packages }
  saveCache(cache)
}

// istanbul ignore next
export function clearCache() {
  if (fs.existsSync(filepath)) fs.unlinkSync(filepath)
}

// istanbul ignore next
function loadCache() {
  if (!fs.existsSync(filepath)) return {}
  return JSON.parse(fs.readFileSync(filepath, { encoding: 'utf-8' }))
}

// istanbul ignore next
function saveCache(cache: Cache) {
  fs.writeFileSync(filepath, JSON.stringify(cache))
}
