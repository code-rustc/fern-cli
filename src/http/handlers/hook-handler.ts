import { Request } from '../transport/request';
import { HttpResponse, RequestHandler } from '../types';
import { CodeRustcApiError } from '../errors/throwable-error';
import { decodeErrorBody } from '../utils/content-type';
import { Hook } from '../hooks/hook';
import { TransportHookAdapter } from '../transport/transport-hook-adapter';

/**
 * Request handler that invokes custom hooks before requests and after responses.
 * Enables request/response interception and custom error handling.
 */
export class HookHandler implements RequestHandler {
  /** Next handler in the chain */
  next?: RequestHandler;

  constructor(private readonly hook: Hook) {}

  /**
   * Handles a standard HTTP request with hook invocation.
   * Calls beforeRequest hook, processes the request, and calls the afterResponse hook.
   * @template T - The expected response data type
   * @param request - The HTTP request to process
   * @returns A promise that resolves to the HTTP response
   * @throws Error if no next handler is set, or if error handling fails
   */
  async handle<T>(request: Request): Promise<HttpResponse<T>> {
    if (!this.next) {
      throw new Error('No next handler set in hook handler.');
    }

    const hook = new TransportHookAdapter<T>();

    const hookParams = this.getHookParams<T>(request);

    const nextRequest = await hook.beforeRequest(request, hookParams);

    const response = await this.next.handle<T>(nextRequest);

    if (response.metadata.status < 400) {
      return await hook.afterResponse(nextRequest, response, hookParams);
    }

    return await this.throwErrorResponse<T>(request, response);
  }

  private async throwErrorResponse<T>(
    request: Request,
    response: HttpResponse<T>,
    resolveUndeclaredError?: () => Promise<unknown>,
  ): Promise<never> {
    // Handle error responses
    const arrayBuffer = response.raw;
    const statusCode = response.metadata.status;
    const body = decodeErrorBody(arrayBuffer, response.metadata.headers['content-type']);

    switch (statusCode) {
    }

    if (resolveUndeclaredError) {
      throw await resolveUndeclaredError();
    }

    throw new CodeRustcApiError({ statusCode, body, rawResponse: response.rawResponse! });
  }

  /**
   * Handles a streaming HTTP request with hook invocation.
   * Calls beforeRequest hook and afterResponse/onError hooks for each chunk.
   * @template T - The expected response data type for each chunk
   * @param request - The HTTP request to process
   * @returns An async generator that yields HTTP responses
   * @throws Error if no next handler is set, or if error handling fails
   */
  async *stream<T>(request: Request): AsyncGenerator<HttpResponse<T>> {
    if (!this.next) {
      throw new Error('No next handler set in hook handler.');
    }

    const hook = new TransportHookAdapter<T>();

    const hookParams = this.getHookParams<T>(request);

    const nextRequest = await hook.beforeRequest(request, hookParams);

    const stream = this.next.stream<T>(nextRequest);

    for await (const response of stream) {
      if (response.metadata.status < 400) {
        yield await hook.afterResponse(nextRequest, response, hookParams);
      } else {
        return await this.throwErrorResponse<T>(request, response, () =>
          hook.onError(nextRequest, response, hookParams),
        );
      }
    }
  }

  /**
   * Extracts hook parameters from the request configuration.
   * @template T - The response data type
   * @param request - The HTTP request
   * @returns A map of hook parameter names to values
   */
  private getHookParams<T>(_request: Request): Map<string, string> {
    const hookParams: Map<string, string> = new Map();
    return hookParams;
  }
}
