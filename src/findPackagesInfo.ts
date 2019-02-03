import Bluebird from 'bluebird';
import find from 'find';
import fs from 'fs';
import path from 'path';

export async function findPackagesInfo(cwd: string): Promise<{ name: string, path: string }[]> {
  let baseDirs = await new Promise<string[]>(a => {
    if (!fs.existsSync(cwd)) {
      a([])
      return
    }
    find.dir('node_modules', cwd, dirs => {
      a(dirs.filter(isPackagePath).map(d => path.join(d, '..')))
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


function isPackagePath(dir: string) {
  const matches = /node_modules\/(.*)\/node_modules/.exec(dir)
  if (!matches) return true

  return /\@.*\/.*/.test(matches[1]) || /^[^\/]+$/.test(matches[1])
}
