import { findByKeyword } from '.';

describe('find local', () => {
  test('not exist folder returns empty array', async () => {
    const actual = await findByKeyword('not-exist-keyword', { cwd: '../fixtures/not-exist' })
    expect(actual).toEqual([])
  })

  test('no node_modues folder returns empty array', async () => {
    const actual = await findByKeyword('not-exist-keyword', { cwd: '../fixtures/no-node_modules' })
    expect(actual).toEqual([])
  })

  test('no package containing keyword returns empty array', async () => {
    const actual = await findByKeyword('some-keyword', { cwd: 'fixtures/no-keyword' })
    expect(actual).toEqual([])
  })

  test('find package containing specified keyword', async () => {
    const actual = await findByKeyword('some-keyword', { cwd: 'fixtures/one-plugin' })
    expect(actual).toEqual(['plugin-a'])
  })

  test('find scoped package containing specified keyword', async () => {
    const actual = await findByKeyword('some-keyword', { cwd: 'fixtures/scoped-one-plugin' })
    expect(actual).toEqual(['@some-scope/plugin-a'])
  })

  test('find package in nested node_modules', async () => {
    const actual = await findByKeyword('some-keyword', { cwd: 'fixtures/nested-one-plugin' })
    expect(actual).toEqual(['plugin-a'])
  })

  test('find scoped package in nested node_modules', async () => {
    const actual = await findByKeyword('some-keyword', { cwd: 'fixtures/nested-scoped-one-plugin' })
    expect(actual).toEqual(['@some-scope/plugin-a'])
  })

  test('@types is ignored', async () => {
    const actual = await findByKeyword('some-keyword', { cwd: 'fixtures/at-types-plugin' })
    expect(actual).toEqual([])
  })

  test('should not get package not under top node_modules hierarchy', async () => {
    const packagesInfo = await findByKeyword('some-keyword')

    expect(packagesInfo).toEqual([])
  })

  test('ignore files under node_modules', async () => {
    const packagesInfo = await findByKeyword('some', { cwd: 'fixtures/node_modules-with-file' })
    expect(packagesInfo.length).toBe(0)
  })
})
