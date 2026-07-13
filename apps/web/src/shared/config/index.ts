/**
 * Configuration — Barrel Export
 *
 * Global configuration, environment helpers, feature flags,
 * and environment validation.
 */

export { APP_CONFIG, APP_NAME, APP_DESCRIPTION, APP_VERSION } from './app-config';
export type { AppConfig } from './app-config';

export {
  isBrowser,
  isServer,
  isDev,
  isProd,
  getEnvVar,
  requireEnvVar,
  getBaseUrl,
} from './env';

export {
  DEFAULT_FLAGS,
  getFeatureFlags,
  setFeatureFlag,
  isFeatureEnabled,
  resetFeatureFlags,
} from './feature-flags';
export type { FeatureFlag, FeatureFlags } from './feature-flags';

export { validateEnv, getEnvConfig, envSchema } from './env-validation';
export type { EnvConfig } from './env-validation';
