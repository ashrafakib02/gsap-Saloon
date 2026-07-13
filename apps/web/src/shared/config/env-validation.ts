/**
 * Environment variable validation powered by Zod.
 *
 * Fails fast at startup when required env vars are missing or malformed.
 * The validated config is cached as a singleton so repeated access is free.
 *
 * @module shared/config/env-validation
 */

import { z } from 'zod';
import { logger } from '@/shared/infra/logger';

/* -------------------------------------------------------------------------- */
/*                                  Schema                                    */
/* -------------------------------------------------------------------------- */

/**
 * Zod schema describing every environment variable the app cares about.
 *
 * All fields are optional — a missing var simply becomes `undefined`.
 * Tighten constraints as the project grows.
 */
export const envSchema = z.object({
  /** Absolute URL to the backend API. */
  VITE_API_URL: z.string().url().optional(),

  /** Domain used by the analytics provider (e.g. `plausible.io`). */
  VITE_ANALYTICS_DOMAIN: z.string().optional(),

  /** Hard toggle for 3-D hero features (`'true'` | `'false'`). */
  VITE_FEATURE_3D: z.enum(['true', 'false']).optional(),

  /** Debug overlays toggle (`'true'` | `'false'`). */
  VITE_DEBUG: z.enum(['true', 'false']).optional(),
});

/** TypeScript type inferred from the Zod schema. */
export type EnvConfig = z.infer<typeof envSchema>;

/* -------------------------------------------------------------------------- */
/*                             Validation logic                               */
/* -------------------------------------------------------------------------- */

/**
 * Validate `import.meta.env` against {@link envSchema} and return the
 * parsed result.
 *
 * Logs a warning (in dev) when unknown `VITE_*` keys are present, and
 * throws when a present value fails the schema.
 *
 * @returns The validated, fully-typed environment configuration.
 * @throws {z.ZodError} When validation fails.
 */
export function validateEnv(): EnvConfig {
  const result = envSchema.safeParse(import.meta.env);

  if (!result.success) {
    const formatted = result.error.format();

    logger.warn('Environment variable validation failed', {
      issues: formatted,
    });

    // Throw in both modes — broken env vars are never acceptable.
    throw result.error;
  }

  if (import.meta.env.DEV) {
    // Surface unknown VITE_* keys so developers don't forget to add them.
    const knownKeys = new Set(Object.keys(envSchema.shape));
    for (const key of Object.keys(import.meta.env)) {
      if (key.startsWith('VITE_') && !knownKeys.has(key)) {
        logger.debug(`Unknown VITE env var detected: ${key}`);
      }
    }
  }

  return result.data;
}

/* -------------------------------------------------------------------------- */
/*                              Singleton cache                               */
/* -------------------------------------------------------------------------- */

let cachedConfig: EnvConfig | null = null;

/**
 * Return the validated environment configuration (cached after first call).
 *
 * Safe to call from anywhere — the validation only runs once.
 *
 * @returns The validated environment configuration.
 *
 * @example
 * ```ts
 * import { getEnvConfig } from '@/shared/config/env-validation';
 *
 * const { VITE_API_URL } = getEnvConfig();
 * ```
 */
export function getEnvConfig(): EnvConfig {
  if (cachedConfig === null) {
    cachedConfig = validateEnv();
  }
  return cachedConfig;
}
