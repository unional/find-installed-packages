import a from 'assertron'
import { getCacheKey } from './cachePackages';

describe('getCacheKey', () => {
  test('cwd is expanded to absolute path', () => {
    const actual = getCacheKey(['some-key'], '.')
    a.satisfies(JSON.parse(actual), { cwd: /find-installed-packages/, keywords: ['some-key'] })
  })

  test('keywords are sorted', () => {
    const actual = getCacheKey(['b-key', 'a-key'], '.')
    expect(actual.indexOf(JSON.stringify(['a-key', 'b-key'])) >= 0).toBeTruthy()
  })
});
