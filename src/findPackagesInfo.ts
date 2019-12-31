import Bluebird from 'bluebird'
import fs from 'fs'
import path from 'path'
import find from 'find'

export async function findPackagesInfo(cwd: string): Promise<{ name: string, path: string }[]> {
  const baseDirs = await new Promise<string[]>(a => {
    if (!fs.existsSync(cwd)) {
      a([])
      return
    }

    find.dir('node_modules', cwd, dirs => {
      a(dirs.filter(dir => isPackagePath(cwd, dir)).map(d => path.join(d, '..')))
    })
  })

  return Bluebird.reduce(baseDirs, async (packages: { name: string, path: string }[], baseDir) => {
    const nodeModulesPath = path.resolve(baseDir, 'node_modules')
    const dirs = await readDirSafe(nodeModulesPath)
    await Promise.all(dirs.map(async dir => {
      if (fs.statSync(path.join(nodeModulesPath, dir)).isDirectory()) {
        if (!dir.startsWith('@'))
          packages.push({ name: dir, path: path.join(nodeModulesPath, dir) })
        else if (dir !== '@types') {
          const foldersInScopedDir = await readDirSafe(path.resolve(nodeModulesPath, dir))
          packages.push(...foldersInScopedDir.map(d => ({ name: `${dir}/${d}`, path: path.join(nodeModulesPath, dir, d) })))
        }
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

function isPackagePath(cwd: string, dir: string) {
  if (!path.relative(cwd, dir).startsWith('node_modules')) return false

  const matches = /node_modules\/(.*)\/node_modules/.exec(dir)
  if (!matches) return true

  return /@.*\/.*/.test(matches[1]) || /^[^/]+$/.test(matches[1])
}
