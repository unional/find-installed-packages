import path from 'path';
import { unpartial } from 'unpartial';
import { findPackagesInfo } from './findPackagesInfo';
import { readFileSafe } from './readFileSafe';

export type FindOptions = {
  cwd: string
}

export async function findByKeyword(keyword: string, options?: Partial<FindOptions>) {
  const { cwd } = unpartial({ cwd: '.' }, options)

  const pkgInfos = await findPackagesInfo(cwd)
  return pkgInfos.filter(pkg => {
    const content = readFileSafe(path.resolve(cwd, pkg.path, 'package.json'))
    if (!content) return false
    const pjson = JSON.parse(content)
    if (!pjson.keywords) return false
    return pjson.keywords.indexOf(keyword) !== -1
  }).map(pkg => pkg.name)
}
