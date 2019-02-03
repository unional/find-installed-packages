import fs from 'fs';
import path from 'path';
import { unpartial } from 'unpartial';
import find from 'find'
import Bluebird from 'bluebird'

export type FindOptions = {
  cwd: string
}

export async function findByKeyword(keyword: string, options: Partial<FindOptions>) {
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

async function findPackagesInfo(cwd: string): Promise<{ name: string, path: string }[]> {
  let baseDirs = await new Promise<string[]>(a => {
    if (!fs.existsSync(cwd)) {
      a([])
      return
    }
    find.dir('node_modules', cwd, dirs => {
      a(dirs.map(d => path.join(d, '..')))
    })
  })

  return Bluebird.reduce(baseDirs, async (packages: { name: string, path: string }[], baseDir) => {
    const nodeModulesPath = path.resolve(baseDir, 'node_modules')
    const dirs = await readDirSafe(nodeModulesPath)
    await Promise.all(dirs.map(async dir => {
      if (!dir.startsWith('@'))
        packages.push({ name: dir, path: path.join(nodeModulesPath, dir) })
      else if (dir !== '@types') {
        const foldersInScopedDir = await readDirSafe(path.resolve(nodeModulesPath, dir))
        packages.push(...foldersInScopedDir.map(d => ({ name: `${dir}/${d}`, path: path.join(nodeModulesPath, dir, d) })))
      }
    }))
    return packages
  }, [])
}

function readDirSafe(path: string) {
  return new Promise<string[]>((a, r) => {
    fs.readdir(path, (err, dirs) => {
      // istanbul ignore next
      if (err && err.code !== 'ENOENT')
        r(err)
      else
        a(dirs)
    })
  })
}


/**
 * Read file and ignore ENOENT.
 * When the the folder is a link, the link may be invalid.
 * That will result in ENOENT.
 * @param path file path.
 */
function readFileSafe(path: string) {
  try {
    return fs.readFileSync(path, 'utf8')
  }
  catch (err) {
    // istanbul ignore next
    if (err.code === 'ENOENT')
      return undefined
    // istanbul ignore next
    throw err
  }
}
