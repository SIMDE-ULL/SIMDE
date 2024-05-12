# Changelog

## [2.5.0](https://github.com/SIMDE-ULL/SIMDE/compare/v2.4.0...v2.5.0) (2024-05-12)


### Features

* implement direct-mapped cache, cache config modal ([#158](https://github.com/SIMDE-ULL/SIMDE/issues/158)) ([15af20a](https://github.com/SIMDE-ULL/SIMDE/commit/15af20a06c30518fbac7e7305ed4b72285968c53))
* **parser:** make line count header optional ([#143](https://github.com/SIMDE-ULL/SIMDE/issues/143)) ([8e072fa](https://github.com/SIMDE-ULL/SIMDE/commit/8e072fa6439f3add0e431c7112aa113e367cfcf9))


### Bug Fixes

* accept CRLF newlines ([#151](https://github.com/SIMDE-ULL/SIMDE/issues/151)) ([aafda4e](https://github.com/SIMDE-ULL/SIMDE/commit/aafda4e704acf27356c96f647a60986b25f85880))
* add VITE_CONFIG_BASE env var to set BASE in vite.config.ts ([#138](https://github.com/SIMDE-ULL/SIMDE/issues/138)) ([b4e1a47](https://github.com/SIMDE-ULL/SIMDE/commit/b4e1a47bcf62dc735b5146a2006a77667c376539))
* correct operand boundary checking ([#166](https://github.com/SIMDE-ULL/SIMDE/issues/166)) ([99faee3](https://github.com/SIMDE-ULL/SIMDE/commit/99faee3a8e73e40d9ff7816699bd2fbf417e1b0e))
* **deps:** update dependency i18next-browser-languagedetector to v8 ([#167](https://github.com/SIMDE-ULL/SIMDE/issues/167)) ([3b4dab1](https://github.com/SIMDE-ULL/SIMDE/commit/3b4dab16219069622468bb9c2406fd09a6654625))
* **interface:** show load code errors ([#145](https://github.com/SIMDE-ULL/SIMDE/issues/145)) ([b9010f8](https://github.com/SIMDE-ULL/SIMDE/commit/b9010f81d527b0fb1c5ad04e70ce8a92c6ffdea2))
* **VLIW:** implement missing ALU instructions ([#165](https://github.com/SIMDE-ULL/SIMDE/issues/165)) ([96b13c0](https://github.com/SIMDE-ULL/SIMDE/commit/96b13c0165a1739ac7ba7b6af10c8b5c5a1895db))

## [2.4.0](https://github.com/SIMDE-ULL/SIMDE/compare/v2.3.0...v2.4.0) (2024-03-31)


### Bug Fixes

* **deps:** update dependency i18next to v23 ([#98](https://github.com/SIMDE-ULL/SIMDE/issues/98)) ([f94b63f](https://github.com/SIMDE-ULL/SIMDE/commit/f94b63f6dd4605fb85d2fe75cb371c6fea589a6f))
* **deps:** update dependency react-i18next to v14 ([#99](https://github.com/SIMDE-ULL/SIMDE/issues/99)) ([d39d6b2](https://github.com/SIMDE-ULL/SIMDE/commit/d39d6b2f8d707a0dd8c93a1b39b9b4b59bb53e28))
* **deps:** update dependency react-redux to v9 ([#100](https://github.com/SIMDE-ULL/SIMDE/issues/100)) ([9b79504](https://github.com/SIMDE-ULL/SIMDE/commit/9b79504c4426bd354e0365ff89290d9f89ccbd93))
* **deps:** update dependency redux to v5 ([#101](https://github.com/SIMDE-ULL/SIMDE/issues/101)) ([9fa8976](https://github.com/SIMDE-ULL/SIMDE/commit/9fa897643e93251aec27a40c40696ef0291aed6c))
* prefix i18next loading path with base URL ([1787d43](https://github.com/SIMDE-ULL/SIMDE/commit/1787d4348904a8704b97508dfc7b47d2e03182d8))
* repair SuperscalarConfigModal layout ([#130](https://github.com/SIMDE-ULL/SIMDE/issues/130)) ([050b27c](https://github.com/SIMDE-ULL/SIMDE/commit/050b27c58b621a985393c71d1b8aca8124bce008))
* review i18n labels ([#126](https://github.com/SIMDE-ULL/SIMDE/issues/126)) ([18c0ec3](https://github.com/SIMDE-ULL/SIMDE/commit/18c0ec3c75ed59c43780793711c8ac978ebce719))
* set correct base for GitHub Pages in vite config ([0595469](https://github.com/SIMDE-ULL/SIMDE/commit/0595469bb46ef96c4c44e44bf30e96c236cf3013))
* **superscalar:** reset current commited instructions on every cycle ([#95](https://github.com/SIMDE-ULL/SIMDE/issues/95)) ([da80167](https://github.com/SIMDE-ULL/SIMDE/commit/da80167c8d18ab1dbeb9e144c24ec169c870067c))


### Miscellaneous Chores

* prepare release version 2.4.0 ([2aa5e57](https://github.com/SIMDE-ULL/SIMDE/commit/2aa5e577ac7ff9a5b2f0536a922ca81207b7c871))

## [2.3.0](https://github.com/SIMDE-ULL/SIMDE/compare/v2.2.0...v2.3.0) (2024-03-13)


### Miscellaneous Chores

* release version 2.3.0 ([9db2300](https://github.com/SIMDE-ULL/SIMDE/commit/9db23006b233f821cb3bac6d5b402705e8d1f8cc))

## [2.2.0](https://github.com/oxcabe/SIMDE/compare/v2.1.0...v2.2.0) (2023-05-22)


### Features

* **vliw:** add memory download action and fix related issues [#45](https://github.com/oxcabe/SIMDE/issues/45) ([defda69](https://github.com/oxcabe/SIMDE/commit/defda6966d8499354f168f109dd9717e872193ea))


### Bug Fixes

* **webpack:** resolve production build issues ([bb050e4](https://github.com/oxcabe/SIMDE/commit/bb050e4b23e4ffbc4f987bb0cc4a04158a45a945))
* **webpack:** set PUBLIC_URL env for production builds ([7f7ff2b](https://github.com/oxcabe/SIMDE/commit/7f7ff2b32b80b1b73e5a2951e1a696b09c9b7949))

## [2.1.0](https://github.com/oxcabe/SIMDE/compare/v2.0.0...v2.1.0) (2023-04-15)


### Features

* empty commit ([ac5c8dd](https://github.com/oxcabe/SIMDE/commit/ac5c8dd39fd82ae784e8b5d265a8277891e5b051))
