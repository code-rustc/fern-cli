import { CodeRustcApiEnvironment } from './http/environment';
import { BaseClientOptions, core } from './http/types';
import { Supplier } from './http/utils/supplier';
import { makePassthroughRequest } from './http/utils/passthrough-request';
import { PetsClient } from './services/pets';

export * as CodeRustcApi from './api';
export { PetsClient } from './services/pets/pets-service';

export * from './http';
export { CodeRustcApiEnvironment } from './http/environment';

export class CodeRustcApiClient {
  public readonly pets: PetsClient;

  constructor(public config: BaseClientOptions) {
    this.pets = new PetsClient(this.config);
  }

  /**
   * Escape hatch for calling an endpoint this SDK doesn't wrap: resolves `input` against the
   * configured baseUrl/environment, applies the SDK's default headers, auth, timeout, and retry
   * policy, and returns the raw `Response` — no request/response schema validation.
   */
  public async fetch(
    input: Request | string | URL,
    init?: RequestInit,
    requestOptions?: core.PassthroughRequest.RequestOptions,
  ): Promise<Response> {
    const resolvedToken = await Supplier.get(this.config.token);
    return makePassthroughRequest(
      input,
      init,
      {
        baseUrl:
          this.config.baseUrl ?? this.config.environment ?? this.config.codeRustcApiEnvironment,
        headers: this.config.headers,
        authHeaders: {
          Authorization: resolvedToken ? 'Bearer ' + resolvedToken : undefined,
        },
        timeoutInSeconds: this.config.timeoutInSeconds,
        maxRetries: this.config.maxRetries,
        fetch: this.config.fetch,
        logging: this.config.logging,
      },
      requestOptions,
    );
  }

  set baseUrl(baseUrl: Supplier<string>) {
    this.pets.baseUrl = baseUrl;
  }

  set codeRustcApiEnvironment(codeRustcApiEnvironment: CodeRustcApiEnvironment) {
    this.pets.baseUrl = codeRustcApiEnvironment;
  }

  set timeoutInSeconds(timeoutInSeconds: number) {
    this.pets.timeoutInSeconds = timeoutInSeconds;
  }

  set environment(environment: Supplier<CodeRustcApiEnvironment | string>) {
    this.pets.environment = environment;
  }

  set token(token: Supplier<string>) {
    this.pets.token = token;
  }
}

// c029837e0e474b76bc487506e8799df5e3335891efe4fb02bda7a1441840310c
