import { Request } from '../transport/request';
import { ContentType, HttpResponse, RequestHandler } from '../types';

/**
 * Request handler that validates and serializes request bodies based on content type.
 * Supports JSON, XML, text, binary, form data, and multipart form data.
 */
export class RequestValidationHandler implements RequestHandler {
  /** Next handler in the chain */
  next?: RequestHandler;

  /**
   * Handles a standard HTTP request with validation.
   * @template T - The expected response data type
   * @param request - The HTTP request to validate
   * @returns A promise that resolves to the HTTP response
   * @throws Error if no next handler is set
   */
  async handle<T>(request: Request): Promise<HttpResponse<T>> {
    if (!this.next) {
      throw new Error('No next handler set in ContentTypeHandler.');
    }

    await this.validateRequest(request);

    return this.next.handle<T>(request);
  }

  /**
   * Handles a streaming HTTP request with validation.
   * @template T - The expected response data type for each chunk
   * @param request - The HTTP request to validate
   * @returns An async generator that yields HTTP responses
   * @throws Error if no next handler is set
   */
  async *stream<T>(request: Request): AsyncGenerator<HttpResponse<T>> {
    if (!this.next) {
      throw new Error('No next handler set in ContentTypeHandler.');
    }

    await this.validateRequest(request);

    yield* this.next.stream<T>(request);
  }

  /**
   * Validates and serializes the request body based on its content type.
   * @param request - The HTTP request to validate
   * Never throws: delegates to validateBody, which still renames properties back to their wire
   * names when the customer's serde layer is off, but never enforces constraint validation.
   */
  validateRequest(request: Request): void {
    // Always true here, even though Fern's client validates nothing when the serde layer is
    // off: unlike Fern, this SDK still renames idiomatic property names back to their wire
    // names in the same schema used for validation, so running it is required to produce a
    // correct wire body — it is not an optional validation step to opt out of. validateBody
    // itself never throws in this mode; see its own comment below.
    const requestValidationEnabled = true;

    if (
      request.requestContentType === ContentType.Text ||
      request.requestContentType === ContentType.Image ||
      request.requestContentType === ContentType.Binary
    ) {
      request.body = request.body;
    } else if (request.requestContentType === ContentType.FormUrlEncoded) {
      request.body = this.toFormUrlEncoded(request, requestValidationEnabled);
    } else if (request.requestContentType === ContentType.MultipartFormData) {
      request.body = this.toFormData(request.body, request.filename, request.filenames);
    } else {
      // ContentType.Json and everything else (arbitrary/unrecognized content types) serialize the
      // same way: validate-then-stringify, or stringify as-is when validation is disabled.
      const serializedBody = requestValidationEnabled
        ? this.validateBody(request, request.body)
        : request.body;
      request.body = JSON.stringify(this.mergeAdditionalBodyParameters(request, serializedBody));
    }
  }

  /**
   * Shallow-merges `requestOptions.additionalBodyParameters` into a JSON object body, using the
   * keys verbatim as wire names so a caller can send a field this SDK version does not declare.
   * The caller's keys win over the generated ones. An absent body becomes the extras; an array
   * or primitive body is returned untouched, since named keys cannot be merged into either.
   */
  private mergeAdditionalBodyParameters(request: Request, body: unknown): unknown {
    const { additionalBodyParameters } = request.config as {
      additionalBodyParameters?: Record<string, unknown>;
    };
    if (!additionalBodyParameters) {
      return body;
    }
    if (body === undefined || body === null) {
      return { ...additionalBodyParameters };
    }
    if (typeof body !== 'object' || Array.isArray(body)) {
      return body;
    }
    return { ...body, ...additionalBodyParameters };
  }

  /**
   * Validates a request body against its schema.
   * Never throws when the serde layer is off: unlike Fern, this SDK still renames idiomatic
   * property names back to their wire names via the schema's own transform, so it must still run.
   * A body that fails a declared constraint falls back to the untransformed value instead of
   * rejecting the call.
   */
  private validateBody(request: Request, body: unknown): unknown {
    if (!request.requestSchema) {
      return body;
    }
    // Fern's client performs no request validation when the serde layer is off — but unlike
    // Fern, this SDK still renames idiomatic property names back to their wire names via the
    // schema's own .transform(), so it must still run. Never throws: a body that fails a
    // declared constraint falls back to the untransformed value instead of rejecting the call.
    const result = request.requestSchema.safeParse(body);
    return result.success ? result.data : body;
  }

  /**
   * Converts request body to URL-encoded form data format.
   * @param request - The HTTP request with body to convert
   * @param requestValidationEnabled - Whether to validate the body against its schema first
   * @returns URL-encoded string representation of the body
   */
  toFormUrlEncoded(request: Request, requestValidationEnabled: boolean): string {
    if (request.body === undefined) {
      return '';
    }

    if (typeof request.body === 'string') {
      return request.body;
    }

    if (request.body instanceof URLSearchParams) {
      return request.body.toString();
    }

    const validatedBody = requestValidationEnabled
      ? this.validateBody(request, request.body)
      : request.body;

    if (validatedBody instanceof FormData) {
      const params = new URLSearchParams();
      validatedBody.forEach((value, key) => {
        if (value != null) {
          params.append(key, value.toString());
        }
      });
      return params.toString();
    }

    if (
      typeof validatedBody === 'object' &&
      validatedBody !== null &&
      !Array.isArray(validatedBody)
    ) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(validatedBody)) {
        if (value == null) continue;
        if (Array.isArray(value)) {
          for (const item of value) {
            if (item != null) params.append(key, `${item}`);
          }
          continue;
        }
        params.append(key, `${value}`);
      }
      return params.toString();
    }

    return '';
  }

  /**
   * Converts request body to multipart form data format.
   * Handles files (ArrayBuffer, Uint8Array, Buffer, or Blob — see `isFileLike` below), arrays,
   * and regular values.
   * @param body - The request body object
   * @param filename - Optional filename for single file uploads
   * @param filenames - Optional filenames array for array of file uploads
   * @returns FormData object with serialized body
   */
  toFormData(body: Record<string, any>, filename?: string, filenames?: string[]): FormData {
    const formData = new FormData();

    Object.keys(body).forEach((key: any) => {
      const value: any = body[key];
      if (Array.isArray(value)) {
        value.forEach((v, i) => {
          if (isFileLike(v)) {
            // For arrays of files, use the corresponding filename from filenames array
            const fileFilename = filenames && filenames[i] ? filenames[i] : `${key}[${i}]`;
            formData.append(`${key}[${i}]`, toBlob(v), fileFilename);
          } else {
            formData.append(`${key}[${i}]`, v);
          }
        });
      } else if (isFileLike(value)) {
        // For single files, use the provided filename or fallback to the key name
        const fileFilename = filename || key;
        formData.append(key, toBlob(value), fileFilename);
      } else {
        formData.append(key, value);
      }
    });

    return formData;
  }
}

/**
 * Whether `value` is one of the runtime shapes Postman's `FileLike` type (FSDK-428) allows for a
 * `format: binary` field: `ArrayBuffer`, any typed-array view (`Uint8Array` or `Buffer` — `Buffer`
 * is itself a `Uint8Array` subclass, so `ArrayBuffer.isView` already covers it), or `Blob`. Kept
 * in sync with `FILE_LIKE_TYPE`
 * (`src/generate/typescript/utils/type-definition.ts`, the generator-side source of truth for the
 * emitted TS type) — every shape that type declares must be recognized here, or a value that
 * type-checks would silently mis-serialize as a plain form field instead of a file part.
 */
function isFileLike(value: unknown): value is ArrayBuffer | ArrayBufferView | Blob {
  return (
    value instanceof ArrayBuffer ||
    ArrayBuffer.isView(value) ||
    (typeof Blob !== 'undefined' && value instanceof Blob)
  );
}

/** Wraps a `FileLike` value as a `Blob`, without double-wrapping a value that already is one. */
function toBlob(value: ArrayBuffer | ArrayBufferView | Blob): Blob {
  return value instanceof Blob ? value : new Blob([value as BlobPart]);
}
