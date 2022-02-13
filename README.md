# vite-plugin-vue-pug-lint

[![npm](https://img.shields.io/npm/v/vite-plugin-vue-pug-lint)](https://www.npmjs.com/package/vite-plugin-vue-pug-lint)
[![GitHub license](https://img.shields.io/github/license/brzezinskimarcin/vite-plugin-vue-pug-lint)](https://github.com/brzezinskimarcin/vite-plugin-vue-pug-lint/blob/main/LICENSE)

Vite pug-lint plugin for vue single file components. If you used [vue-pug-lint-loader](https://github.com/UniSharp/vue-pug-lint-loader) and would like to have the same functionality you might need this plugin.

## Install

```
npm install vite-plugin-vue-pug-lint --save-dev
# or
yarn add vite-plugin-vue-pug-lint --dev
```

## Usage

```js
import { defineConfig } from 'vite';
import pugLint from 'vite-plugin-vue-pug-lint';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    pugLint(),
    vue(),
  ],
});
```

## Options

### `configFile`

- Type: `string`
- Default: `undefined`

Custom config file path, equivalent to specifying -c option in pug-lint cli.
If not provided, it looks for default config files, like described in [pug-lint readme](https://github.com/pugjs/pug-lint#configuration-file).

### `include`

- Type: [`FilterPattern`](https://github.com/rollup/plugins/blob/master/packages/pluginutils/types/index.d.ts#L23)
- Default: `/\.vue$/`

File(s) to include when linting

### `exclude`

- Type: [`FilterPattern`](https://github.com/rollup/plugins/blob/master/packages/pluginutils/types/index.d.ts#L23)
- Default: `/node_modules/`

File(s) to exclude when linting

## License

MIT
