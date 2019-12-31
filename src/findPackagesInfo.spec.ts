import a from 'assertron'
import { findPackagesInfo } from './findPackagesInfo'

test('node_modules in test folder will not take into consideration', async () => {
  const packagesInfo = await findPackagesInfo('fixtures/node_modules-in-test')

  a.satisfies(packagesInfo, [{ name: 'pkg-with-test' }])
  expect(packagesInfo.length).toBe(1)
})
