export * as CodeRustcApi from './api/index.js';
export type { BaseClientOptions, BaseRequestOptions } from './BaseClient.js';
export { CodeRustcApiClient } from './Client.js';
export { CodeRustcApiEnvironment } from './environments.js';
export { CodeRustcApiError, CodeRustcApiTimeoutError } from './errors/index.js';
export * from './exports.js';

// UAT-022 customer customization X (no conflict expected)
export const UAT_CUSTOM_MARKER = "kept-by-replay";
