import { Supplier } from './utils/supplier';

/**
 * A pluggable request-auth override (FSDK-429), matching Fern's own `core.AuthProvider` shape
 * exactly. Implement this to compute auth headers per-request — e.g. refreshing a short-lived
 * token — instead of the SDK's default credential resolution.
 */
export interface AuthRequest {
  headers: Record<string, string>;
}

export interface AuthProvider {
  getAuthRequest(arg?: { endpointMetadata?: Record<string, unknown> }): Promise<AuthRequest>;
}

export function isAuthProvider(value: unknown): value is AuthProvider {
  return (
    typeof value === 'object' &&
    value !== null &&
    'getAuthRequest' in value &&
    typeof (value as { getAuthRequest?: unknown }).getAuthRequest === 'function'
  );
}

/** Disables auth entirely — every request goes out with no auth header at all. */
export class NoOpAuthProvider implements AuthProvider {
  public getAuthRequest(): Promise<AuthRequest> {
    return Promise.resolve({ headers: {} });
  }
}

/**
 * Resolves `BaseClientOptions.auth` into the header(s) an access-token-authenticated request
 * should carry, falling back to the SDK's own default credential when `auth` wasn't set — see
 * `BaseClientOptions.auth`'s own doc for the accepted shapes. Scoped to the access-token/bearer
 * scheme specifically (matching this SDK's own default credential flow); a plain-object override
 * only ever supplies that scheme's own credential, not an arbitrary alternate scheme.
 */
export async function resolveAuthHeaders(
  auth:
    | false
    | AuthProvider['getAuthRequest']
    | AuthProvider
    | { token?: Supplier<string> }
    | undefined,
  defaultToken: string | undefined,
  prefix: string,
): Promise<Record<string, string> | undefined> {
  if (auth === false) {
    return undefined;
  }
  if (typeof auth === 'function') {
    return (await auth()).headers;
  }
  if (isAuthProvider(auth)) {
    return (await auth.getAuthRequest()).headers;
  }
  const token = auth?.token !== undefined ? await Supplier.get(auth.token) : defaultToken;
  return token === undefined ? undefined : { Authorization: `${prefix} ${token}` };
}
