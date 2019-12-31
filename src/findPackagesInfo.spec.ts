import a from 'assertron'
import { findPackagesInfo } from './findPackagesInfo'

test('node_modules in test folder will not take into consideration', () => {
  const packagesInfo = findPackagesInfo('fixtures/node_modules-in-test')

  a.satisfies(packagesInfo, [{ name: 'pkg-with-test' }])
})

test('folder without node_modules will not considered', () => {
  const packagesInfo = findPackagesInfo('fixtures/no-node_modules')

  expect(packagesInfo.length).toBe(0)
})
