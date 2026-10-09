export const CodeRustcApiEnvironment = {
  Default: 'https://petstore.example.com/v1',
} as const;

export type CodeRustcApiEnvironment =
  (typeof CodeRustcApiEnvironment)[keyof typeof CodeRustcApiEnvironment];
