import { RawResponse } from '../utils/fetcher';

/**
 * Base class for every error thrown by this SDK.
 * Exposes the HTTP status code, response body, raw response metadata, and (when available)
 * the underlying cause, plus a `requestId` getter read from the `x-request-id` response header.
 */
export class CodeRustcApiError extends Error {
  public readonly statusCode?: number;
  public readonly body?: unknown;
  public readonly rawResponse?: RawResponse;
  public readonly cause?: unknown;

  constructor(opts: {
    message?: string;
    statusCode?: number;
    body?: unknown;
    rawResponse?: RawResponse;
    cause?: unknown;
  }) {
    super(buildMessage(opts));
    Object.setPrototypeOf(this, new.target.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = 'CodeRustcApiError';
    this.statusCode = opts.statusCode;
    this.body = opts.body;
    this.rawResponse = opts.rawResponse;
    if (opts.cause != null) {
      this.cause = opts.cause;
    }
  }

  /**
   * The `x-request-id` response header, if present. `Headers.get()` is case-insensitive per the
   * Fetch spec, so no manual case-folding is needed here (unlike the old `HttpMetadata`-backed
   * plain-object lookup this replaced).
   */
  get requestId(): string | undefined {
    return this.rawResponse?.headers.get('x-request-id') ?? undefined;
  }
}

function buildMessage(opts: { message?: string; statusCode?: number; body?: unknown }): string {
  const lines: string[] = [];
  if (opts.message != null) {
    lines.push(opts.message);
  }
  if (opts.statusCode != null) {
    lines.push(`Status code: ${opts.statusCode}`);
  }
  if (opts.body != null) {
    lines.push(`Body: ${JSON.stringify(opts.body, undefined, 2)}`);
  }
  return lines.join('\n');
}
