import { findByKeywords } from '.';

describe('find local', () => {
  test('not exist folder returns empty array', async () => {
    const actual = await findByKeywords(['not-exist-keyword'], { cwd: '../fixtures/not-exist' })
    expect(actual).toEqual([])
  })

  test('no node_modues folder returns empty array', async () => {
    const actual = await findByKeywords(['not-exist-keyword'], { cwd: '../fixtures/no-node_modules' })
    expect(actual).toEqual([])
  })

  test('no package containing keyword returns empty array', async () => {
    const actual = await findByKeywords(['some-keyword'], { cwd: 'fixtures/no-keyword' })
    expect(actual).toEqual([])
  })

  test('find package containing specified keyword', async () => {
    const actual = await findByKeywords(['some-keyword'], { cwd: 'fixtures/one-plugin' })
    expect(actual).toEqual(['plugin-a'])
  })

  test('package does not contain all keywords do not return', async () => {
    const actual = await findByKeywords(['some-keyword', 'another-keyword'], { cwd: 'fixtures/one-plugin' })
    expect(actual).toEqual([])
  })

  test('find package contains all keywords', async () => {
    const actual = await findByKeywords(['some-keyword', 'another-keyword'], { cwd: 'fixtures/multi-keywords' })
    expect(actual).toEqual(['plugin-m'])
  })

  test('find scoped package containing specified keyword', async () => {
    const actual = await findByKeywords(['some-keyword'], { cwd: 'fixtures/scoped-one-plugin' })
    expect(actual).toEqual(['@some-scope/plugin-a'])
  })

  test('scoped package does not contain all keywords do not return', async () => {
    const actual = await findByKeywords(['some-keyword', 'another-keyword'], { cwd: 'fixtures/scoped-one-plugin' })
    expect(actual).toEqual([])
  })

  test('find package in nested node_modules', async () => {
    const actual = await findByKeywords(['some-keyword'], { cwd: 'fixtures/nested-one-plugin' })
    expect(actual).toEqual(['plugin-a'])
  })

  test('find scoped package in nested node_modules', async () => {
    const actual = await findByKeywords(['some-keyword'], { cwd: 'fixtures/nested-scoped-one-plugin' })
    expect(actual).toEqual(['@some-scope/plugin-a'])
  })

  test('@types is ignored', async () => {
    const actual = await findByKeywords(['some-keyword'], { cwd: 'fixtures/at-types-plugin' })
    expect(actual).toEqual([])
  })

  test('should not get package not under top node_modules hierarchy', async () => {
    const packagesInfo = await findByKeywords(['some-keyword'])

    expect(packagesInfo).toEqual([])
  })
})
