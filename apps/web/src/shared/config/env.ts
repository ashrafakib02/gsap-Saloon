/**
 * Runtime environment helpers.
 *
 * Every export is SSR-safe — they never touch `window` / `document` unless
 * the runtime is confirmed to be a browser.
 *
 * @module shared/config/env
 */

/* -------------------------------------------------------------------------- */
/*                               Environment                                  */
/* -------------------------------------------------------------------------- */

/**
 * `true` when running inside a browser (client-side).
 *
 * Uses a runtime check so the value is correct during SSR and in Vite's
 * client-only modules.
 */
export const isBrowser: boolean = typeof window !== 'undefined';

/**
 * `true` when running on the server (SSG, SSR, Node, etc.).
 */
export const isServer: boolean = !isBrowser;

/**
 * `true` when Vite is in development mode (`import.meta.env.DEV`).
 */
export const isDev: boolean = import.meta.env.DEV;

/**
 * `true` when Vite is in production mode (`import.meta.env.PROD`).
 */
export const isProd: boolean = import.meta.env.PROD;

/* -------------------------------------------------------------------------- */
/*                             Env-var helpers                                */
/* -------------------------------------------------------------------------- */

/**
 * Read an arbitrary Vite environment variable by key.
 *
 * Vite exposes only `VITE_*`-prefixed variables at build time; anything
 * else will return `undefined`.
 *
 * @param key     - The env-var name (e.g. `'VITE_API_URL'`).
 * @param fallback - Value to return when the variable is absent or empty.
 * @returns The variable value, or `fallback` when unset.
 *
 * @example
 * ```ts
 * const apiUrl = getEnvVar('VITE_API_URL', '/api');
 * ```
 */
export function getEnvVar(key: string, fallback?: string): string | undefined {
  const value = import.meta.env[key] as string | undefined;
  if (value !== undefined && value !== '') {
    return value;
  }
  return fallback;
}

/**
 * Read a **required** Vite environment variable.
 *
 * Throws immediately if the variable is missing so the failure is
 * deterministic and loud rather than a silent `undefined` downstream.
 *
 * @param key - The env-var name (e.g. `'VITE_API_URL'`).
 * @returns The variable value.
 * @throws {Error} When the variable is not set.
 *
 * @example
 * ```ts
 * const apiUrl = requireEnvVar('VITE_API_URL');
 * ```
 */
export function requireEnvVar(key: string): string {
  const value = import.meta.env[key] as string | undefined;
  if (value === undefined || value === '') {
    throw new Error(
      `[Sovereign] Required environment variable "${key}" is not set.`,
    );
  }
  return value;
}

/**
 * Resolve the base URL for API requests.
 *
 * Checks `VITE_API_URL` first; falls back to `window.location.origin`
 * in the browser or an empty string on the server.
 *
 * @returns Absolute or relative base URL string.
 */
export function getBaseUrl(): string {
  const envUrl = getEnvVar('VITE_API_URL');
  if (envUrl) {
    return envUrl;
  }

  if (isBrowser) {
    return window.location.origin;
  }

  return '';
}
