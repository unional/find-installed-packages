import { findByKeyword } from './findByKeyword';

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
})

