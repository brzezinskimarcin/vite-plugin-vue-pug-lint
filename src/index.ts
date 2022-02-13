import type { Plugin } from 'vite';
import type { PugError } from 'pug-lint';
import type { FilterPattern } from '@rollup/pluginutils';

import PugLinter from 'pug-lint';
import ConfigLoader from 'pug-lint/lib/config-file';
import { DomHandler, Parser } from 'htmlparser2';
import { load } from 'cheerio';
import { createFilter } from '@rollup/pluginutils';

/**
 * Plugin options
 */
export interface PluginOptions {
  /**
   * Custom config file path, equivalent to specifying -c option in pug-lint cli.
   * If not provided, it looks for default config files, like described in pug-lint readme.
   * @default undefined
   */
  configFile?: string;
  /**
   * File(s) to include when linting
   * @default /\.vue$/
   */
  include?: FilterPattern;
  /**
   * File(s) to exclude when linting
   * @default /node_modules/
   */
  exclude?: FilterPattern;
}

function createAndConfigureLinter(configFile?: string) {
  const linter = new PugLinter();
  const config = ConfigLoader.load(configFile);
  linter.configure(config);
  return linter;
}

function createParser() {
  let pugTemplate: string;
  const parseHandler = new DomHandler((error, dom) => {
    if (error) {
      return console.error(error);
    }

    const $ = load(dom);
    pugTemplate = $('template[lang="pug"]').text();
  });
  const parser = new Parser(parseHandler);

  return {
    parse(code: string) {
      parser.parseComplete(code);
      return pugTemplate;
    },
  };
}

function formatErrors(errors: PugError[]) {
  const lintFailedPrefix = 'pug-lint failed:';
  const sortedErrors = errors.sort(
    (a, b) => a.line - b.line || (a.column || 0) - (b.column || 0),
  );

  return `
    ${lintFailedPrefix}
    ${sortedErrors.map((error) => {
      const lineInfo = `${error.line}:${error.column || 0}`;
      const errorPrefix = 'error';
      const errorMessage = error.msg;
      const errorCodeFrame = error.message.split('\n').slice(1, -2).join('\n');

      return `\n${lineInfo}\t${errorPrefix}\t${errorMessage}\n${errorCodeFrame}`;
    })}
  `;
}

const defaultOptions = {
  configFile: undefined,
  include: /\.vue$/,
  exclude: /node_modules/,
};

export default function vuePuglintPlugin(
  userOptions: PluginOptions = {},
): Plugin {
  const options: PluginOptions = {
    ...defaultOptions,
    ...userOptions,
  };
  const linter = createAndConfigureLinter(options.configFile);
  const filter = createFilter(options.include, options.exclude);
  const parser = createParser();

  return {
    name: 'vite:vue-pug-lint',
    async transform(code: string, id: string) {
      if (!filter(id)) {
        return null;
      }

      const pugTemplate = parser.parse(code);
      const errors = linter.checkString(pugTemplate);
      if (errors && errors.length) {
        this.error(formatErrors(errors));
      }

      return null;
    },
  };
}
