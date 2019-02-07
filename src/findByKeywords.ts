import path from 'path';
import { unpartial } from 'unpartial';
import { findPackagesInfo } from './findPackagesInfo';
import { readFileSafe } from './readFileSafe';
import { hasAllKeywords } from './hasAllKeywords';

export type FindOptions = {
  cwd: string
}

export async function findByKeywords(keywords: string[], options?: Partial<FindOptions>) {
  const { cwd } = unpartial({ cwd: '.' }, options)

  const pkgInfos = await findPackagesInfo(cwd)
  return pkgInfos.filter(pkg => {
    const content = readFileSafe(path.resolve(cwd, pkg.path, 'package.json'))
    if (!content) return false
    const pjson = JSON.parse(content)
    if (!pjson.keywords) return false
    return hasAllKeywords(pjson.keywords, keywords)
  }).map(pkg => pkg.name)
}
