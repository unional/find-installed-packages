import fs from 'fs'
import path from 'path'
export type PackageInfo = { name: string, path: string }

export function findPackagesInfo(cwd: string): PackageInfo[] {
  if (!fs.existsSync(cwd)) return []

  return recurseFind(cwd)
}

function recurseFind(cwd: string) {
  const nodeModulesDir = path.join(cwd, 'node_modules')
  if (!fs.existsSync(nodeModulesDir)) return []

  const dirs = fs.readdirSync(nodeModulesDir)
  return dirs.reduce((p, dir) => {
    const packagePath = path.join(nodeModulesDir, dir)
    if (!fs.statSync(packagePath).isDirectory()) return p
    if (dir.startsWith('@')) {
      if (dir === '@types') return p
      const subDirs = fs.readdirSync(path.join(nodeModulesDir, dir))
      subDirs.forEach(sd => {
        const packagePath = path.join(nodeModulesDir, dir, sd)
        if (!fs.statSync(packagePath).isDirectory()) return
        p.push({ name: `${dir}/${sd}`, path: packagePath })
        p.push(...recurseFind(packagePath))
      })
    }
    else {
      p.push({ name: dir, path: packagePath })
      p.push(...recurseFind(packagePath))
    }

    return p
  }, [] as PackageInfo[])
}
