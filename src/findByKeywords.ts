import path from 'path'
import { unpartial } from 'unpartial'
import { findPackagesInfo } from './findPackagesInfo'
import { hasAllKeywords } from './hasAllKeywords'
import { readFileSafe } from './readFileSafe'
import { FindOptions } from './types'
import { getCacheKey, getCachedPackages, setCachedPackages } from './cachePackages'


export async function findByKeywords(keywords: string[], options?: Partial<FindOptions>) {
  const { cwd } = unpartial({ cwd: '.' }, options)
  const cacheKey = getCacheKey(keywords, cwd)
  const cache = getCachedPackages(cacheKey)
  if (cache) {
    // istanbul ignore next
    setImmediate(async () => {
      const packages = await getPackages(keywords, cwd)
      setCachedPackages(cacheKey, packages)
    })
    return cache
  }

  const packages = await getPackages(keywords, cwd)
  setCachedPackages(cacheKey, packages)
  return packages
}

async function getPackages(keywords: string[], cwd: string) {
  const pkgInfos = await findPackagesInfo(cwd)
  return pkgInfos.filter(pkg => {
    const content = readFileSafe(path.resolve(cwd, pkg.path, 'package.json'))
    if (!content) return false
    const pjson = JSON.parse(content)
    if (!pjson.keywords) return false
    return hasAllKeywords(pjson.keywords, keywords)
  }).map(pkg => pkg.name)
}
