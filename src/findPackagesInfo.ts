import fs from 'fs'
import path from 'path'
export type PackageInfo = { name: string, ctimeMs: number, path: string }

export function findPackagesInfo(cwd: string): PackageInfo[] {
  if (!fs.existsSync(cwd)) return []

  return recurseFind(cwd)
}

function recurseFind(cwd: string) {
  const nodeModulesDir = path.join(cwd, 'node_modules')
  if (!fs.existsSync(nodeModulesDir)) return []

  try {
    const dirs = fs.readdirSync(nodeModulesDir)
    return dirs.reduce((p, dir) => {
      const packagePath = path.join(nodeModulesDir, dir)
      const stat = fs.statSync(packagePath)
      if (!stat.isDirectory()) return p
      if (dir.startsWith('@')) {
        if (dir === '@types') return p
        const subDirs = fs.readdirSync(path.join(nodeModulesDir, dir))
        subDirs.forEach(sd => {
          const packagePath = path.join(nodeModulesDir, dir, sd)
          const stat = fs.statSync(packagePath)
          // istanbul ignore next
          if (!stat.isDirectory()) return
          p.push({ name: `${dir}/${sd}`, ctimeMs: stat.ctimeMs, path: packagePath })
          p.push(...recurseFind(packagePath))
        })
      }
      else {
        p.push({ name: dir, ctimeMs: stat.ctimeMs, path: packagePath })
        p.push(...recurseFind(packagePath))
      }

      return p
    }, [] as PackageInfo[])
  }
  catch {
    // e.g. permission denied
    // istanbul ignore next
    return []
  }
}
