# CodeRustc TypeScript Library

[![fern shield](https://img.shields.io/badge/%F0%9F%8C%BF-Built%20with%20Fern-brightgreen)](https://buildwithfern.com?utm_source=github&utm_medium=github&utm_campaign=readme&utm_source=CodeRustc%2FTypeScript)

The CodeRustc TypeScript library provides convenient access to the CodeRustc APIs from TypeScript.

## Table of Contents

- [Reference](#reference)
- [Usage](#usage)
- [Request and Response Types](#request-and-response-types)
- [Exception Handling](#exception-handling)
- [Advanced](#advanced)
  - [Subpackage Exports](#subpackage-exports)
  - [Additional Headers](#additional-headers)
  - [Additional Query String Parameters](#additional-query-string-parameters)
  - [Retries](#retries)
  - [Timeouts](#timeouts)
  - [Aborting Requests](#aborting-requests)
  - [Access Raw Response Data](#access-raw-response-data)
  - [Logging](#logging)
  - [Custom Fetch](#custom-fetch)
  - [Custom Fetcher](#custom-fetcher)
  - [Runtime Compatibility](#runtime-compatibility)
- [Contributing](#contributing)

## Reference

A full reference for this library is available [here](./reference.md).

## Usage

Instantiate and use the client with the following:

```typescript
import { CodeRustcApiClient } from 'uat026-w5e0z';

const client = new CodeRustcApiClient({
  token: 'YOUR_TOKEN',
});
await client.pets.listPets({
  limit: 81,
});
```

## Request and Response Types

The SDK exports all request and response types as TypeScript interfaces. Simply import them with the
following namespace:

```typescript
import { CodeRustcApi } from "uat026-w5e0z";

const request: CodeRustcApi.ListPetsRequest = {
    ...
};
```

## Exception Handling

When the API returns a non-success status code (4xx or 5xx response), a subclass of the following error
will be thrown.

```typescript
import { CodeRustcApiError } from "uat026-w5e0z";

try {
    await client.pets.listPets(...);
} catch (err) {
    if (err instanceof CodeRustcApiError) {
        console.log(err.statusCode);
        console.log(err.message);
        console.log(err.body);
        console.log(err.rawResponse);
    }
}
```

## Advanced

### Subpackage Exports

This SDK supports direct imports of subpackage clients, which allows JavaScript bundlers to tree-shake and include only the imported subpackage code. This results in much smaller bundle sizes.

```typescript
import { PetsClient } from 'uat026-w5e0z/pets';

const client = new PetsClient({...});
```

### Additional Headers

If you would like to send additional headers as part of the request, use the `headers` request option.

```typescript
const response = await client.pets.listPets(..., {
    headers: {
        'X-Custom-Header': 'custom value'
    }
});
```

### Additional Query String Parameters

> [!NOTE]
> The `queryParams` request option is accepted by the type signature but is not yet applied to the
> outgoing request. Until it is wired up, put additional query string parameters in the URL you
> pass to `client.fetch()` (see [Custom Fetch](#custom-fetch)).

```typescript
const response = await client.pets.listPets(..., {
    queryParams: {
        'customQueryParamKey': 'custom query param value'
    }
});
```

### Retries

The SDK retries requests that fail with a 408 (Timeout), 429 (Too Many Requests), or any 5XX server
error, using exponential backoff, up to a configured retry limit (default: 2).

Use the `maxRetries` request option to configure this behavior.

```typescript
const response = await client.pets.listPets(..., {
    maxRetries: 0 // override maxRetries at the request level
});
```

### Timeouts

The SDK defaults to a 60 second timeout. Use the `timeoutInSeconds` option to configure this behavior.

```typescript
const response = await client.pets.listPets(..., {
    timeoutInSeconds: 30 // override timeout to 30s
});
```

### Aborting Requests

The SDK allows users to abort requests at any point by passing in an abort signal.

```typescript
const controller = new AbortController();
const response = await client.pets.listPets(..., {
    abortSignal: controller.signal
});
controller.abort(); // aborts the request
```

### Access Raw Response Data

The SDK provides access to raw response data, including headers, through the `.withRawResponse()` method.
The `.withRawResponse()` method returns a promise that resolves to an object with a `data` and a `rawResponse` property.

```typescript
const { data, rawResponse } = await client.pets.listPets(...).withRawResponse();

console.log(data);
console.log(rawResponse.headers['X-My-Header']);
```

### Logging

The SDK supports logging. You can configure the logger by passing in a `logging` object to the client options.

```typescript
import { CodeRustcApiClient, logging } from "uat026-w5e0z";

const client = new CodeRustcApiClient({
    ...
    logging: {
        level: logging.LogLevel.Debug, // defaults to logging.LogLevel.Info
        logger: new logging.ConsoleLogger(), // defaults to ConsoleLogger
        silent: false, // defaults to true, set to false to enable logging
    }
});
```

The `logging` object can have the following properties:

- `level`: The log level to use. Defaults to `logging.LogLevel.Info`.
- `logger`: The logger to use. Defaults to a `logging.ConsoleLogger`.
- `silent`: Whether to silence the logger. Defaults to `true`.

To provide a custom logger, you can pass in an object that implements the `logging.ILogger` interface.

### Custom Fetch

The SDK provides a low-level `fetch` method for making custom HTTP requests while still
benefiting from SDK-level configuration like authentication, retries, timeouts, and logging.
This is useful for calling API endpoints not yet supported in the SDK.

```typescript
const response = await client.fetch(
  '/v1/custom/endpoint',
  {
    method: 'GET',
  },
  {
    timeoutInSeconds: 30,
    maxRetries: 3,
    headers: {
      'X-Custom-Header': 'custom-value',
    },
  },
);

const data = await response.json();
```

### Custom Fetcher

The SDK provides a way for you to customize the underlying fetch implementation it uses to send
requests. If you're running in an unsupported environment, this provides a way for you to break
glass and ensure the SDK works.

```typescript
import { CodeRustcApiClient } from "uat026-w5e0z";

const client = new CodeRustcApiClient({
    ...
    fetch: // provide your implementation here
});
```

### Runtime Compatibility

The SDK works in the following runtimes:

- Node.js 18+
- Vercel
- Cloudflare Workers
- Deno v1.25+
- Bun 1.0+
- React Native

## Contributing

While we value open-source contributions to this SDK, this library is generated programmatically.
Additions made directly to this library would have to be moved over to our generation code,
otherwise they would be overwritten upon the next generated release. Feel free to open a PR as
a proof of concept, but know that we will not be able to merge it as-is. We suggest opening
an issue first to discuss with us!

On the other hand, contributions to the README are always very welcome!
