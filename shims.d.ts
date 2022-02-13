interface Options {}

declare module 'pug-lint' {
  interface PugError {
    filename: string;
    src: string;
    line: number;
    column: number;
    message: string;
    msg: string;
  }

  export default class PugLint {
    configure: (options: Options) => void;
    checkString: (source: string, filename?: string) => PugError[];
  }
}

declare module 'pug-lint/lib/config-file' {
  export function load(path?: string): Options;
}
