# find-installed-packages

![unstable][unstable-image]
[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]

[![Circle CI][circleci-image]][circleci-url]
[![Travis CI][travis-image]][travis-url]
[![Codecov][codecov-image]][codecov-url]
[![Coveralls Status][coveralls-image]][coveralls-url]

[![Greenkeeper][greenkeeper-image]][greenkeeper-url]
[![Semantic Release][semantic-release-image]][semantic-release-url]

[![Visual Studio Code][vscode-image]][vscode-url]
[![Wallaby.js][wallaby-image]][wallaby-url]

Find installed packages.

## Usage

```ts
import { findByKeyword } from 'find-installed-packages'

(async () => {
  const packages = await findByKeyord('some-keyword') // ['pkg-a', 'pkg-b']
}())
```

## Contribute

```sh
# after fork and clone
npm install

# begin making changes
git checkout -b <branch>
npm run watch

# after making change(s)
git commit -m "<commit message>"
git push

# create PR
```

[circleci-image]: https://circleci.com/gh/unional/find-installed-packages/tree/master.svg?style=shield
[circleci-url]: https://circleci.com/gh/unional/find-installed-packages/tree/master
[codecov-image]: https://codecov.io/gh/unional/find-installed-packages/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/unional/find-installed-packages
[coveralls-image]: https://coveralls.io/repos/github/unional/find-installed-packages/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/unional/find-installed-packages?branch=master
[downloads-image]: https://img.shields.io/npm/dm/find-installed-packages.svg?style=flat
[downloads-url]: https://npmjs.org/package/find-installed-packages
[greenkeeper-image]: https://badges.greenkeeper.io/unional/find-installed-packages.svg
[greenkeeper-url]: https://greenkeeper.io/
[npm-image]: https://img.shields.io/npm/v/find-installed-packages.svg?style=flat
[npm-url]: https://npmjs.org/package/find-installed-packages
[semantic-release-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[travis-image]: https://img.shields.io/travis/unional/find-installed-packages/master.svg?style=flat
[travis-url]: https://travis-ci.org/unional/find-installed-packages?branch=master
[unstable-image]: https://img.shields.io/badge/stability-unstable-yellow.svg
[vscode-image]: https://img.shields.io/badge/vscode-ready-green.svg
[vscode-url]: https://code.visualstudio.com/
[wallaby-image]: https://img.shields.io/badge/wallaby.js-configured-green.svg
[wallaby-url]: https://wallabyjs.com
