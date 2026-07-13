/**
 * API client infrastructure — base types, configuration, and interface.
 * The actual HTTP implementation is deferred to Phase 10.
 *
 * @module api-client
 */

/**
 * Configuration for the API client.
 */
interface ApiClientConfig {
  /** Base URL for all API requests (e.g., '/api'). */
  baseUrl: string;
  /** Request timeout in milliseconds. */
  timeout: number;
  /** Default headers sent with every request. */
  headers: Record<string, string>;
  /** Number of retries for failed requests. */
  retries: number;
  /** Delay in milliseconds between retries. */
  retryDelay: number;
}

/**
 * Options for a single API request.
 */
interface RequestOptions {
  /** HTTP method. */
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** Request path relative to the base URL (e.g., '/services'). */
  path: string;
  /** Request body (automatically serialized to JSON). */
  body?: unknown;
  /** URL query parameters. */
  params?: Record<string, string | number | boolean>;
  /** Additional headers for this request. */
  headers?: Record<string, string>;
  /** AbortSignal for request cancellation. */
  signal?: AbortSignal;
}

/**
 * Successful API response wrapper.
 */
interface ApiClientResponse<T> {
  /** Parsed response data. */
  data: T;
  /** HTTP status code. */
  status: number;
  /** Response headers. */
  headers: Record<string, string>;
}

/**
 * API error with status code, message, and optional validation details.
 */
interface ApiClientError {
  /** HTTP status code. */
  status: number;
  /** Human-readable error message. */
  message: string;
  /** Machine-readable error code (e.g., 'VALIDATION_ERROR'). */
  code: string;
  /** Optional field-level validation errors. */
  details?: Record<string, string[]>;
}

/**
 * The API client instance returned by {@link createApiClient}.
 */
interface ApiClientInstance {
  /** Send an arbitrary request. */
  request<T>(options: RequestOptions): Promise<ApiClientResponse<T>>;
  /** Send a GET request. */
  get<T>(path: string, params?: Record<string, string | number | boolean>): Promise<ApiClientResponse<T>>;
  /** Send a POST request. */
  post<T>(path: string, body?: unknown): Promise<ApiClientResponse<T>>;
  /** Send a PUT request. */
  put<T>(path: string, body?: unknown): Promise<ApiClientResponse<T>>;
  /** Send a PATCH request. */
  patch<T>(path: string, body?: unknown): Promise<ApiClientResponse<T>>;
  /** Send a DELETE request. */
  delete<T>(path: string): Promise<ApiClientResponse<T>>;
}

/**
 * Default API client configuration.
 */
const DEFAULT_API_CONFIG: Readonly<ApiClientConfig> = Object.freeze({
  baseUrl: '/api',
  timeout: 30_000, // 30 seconds
  headers: Object.freeze({
    'Content-Type': 'application/json',
  }),
  retries: 2,
  retryDelay: 1000,
});

/**
 * Creates an API client instance with the given configuration.
 *
 * The actual HTTP implementation is deferred to Phase 10.
 * All methods currently throw `Error('API client not yet implemented')`.
 *
 * @example
 * ```ts
 * const api = createApiClient({ baseUrl: '/api/v2' });
 *
 * // Phase 10+:
 * const { data } = await api.get<Service[]>('/services');
 * ```
 *
 * @param overrides - Partial configuration to merge with defaults.
 * @returns An API client instance.
 */
function createApiClient(overrides?: Partial<ApiClientConfig>): ApiClientInstance {
  const config = { ...DEFAULT_API_CONFIG, ...overrides };

  const notImplemented = (): never => {
    throw new Error('API client not yet implemented — coming in Phase 10');
  };

  return {
    request<T>(_options: RequestOptions): Promise<ApiClientResponse<T>> {
      void config; // Acknowledge config exists for future use
      return notImplemented();
    },

    get<T>(_path: string, _params?: Record<string, string | number | boolean>): Promise<ApiClientResponse<T>> {
      return notImplemented();
    },

    post<T>(_path: string, _body?: unknown): Promise<ApiClientResponse<T>> {
      return notImplemented();
    },

    put<T>(_path: string, _body?: unknown): Promise<ApiClientResponse<T>> {
      return notImplemented();
    },

    patch<T>(_path: string, _body?: unknown): Promise<ApiClientResponse<T>> {
      return notImplemented();
    },

    delete<T>(_path: string): Promise<ApiClientResponse<T>> {
      return notImplemented();
    },
  };
}

export type {
  ApiClientConfig,
  RequestOptions,
  ApiClientResponse,
  ApiClientError,
  ApiClientInstance,
};
export { DEFAULT_API_CONFIG, createApiClient };
