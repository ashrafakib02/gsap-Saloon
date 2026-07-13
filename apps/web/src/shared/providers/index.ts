/**
 * Provider Infrastructure — Barrel Export
 *
 * Provider composition, factory, context utilities.
 */

export {
  composeProviders,
  createProviderStack,
  ProviderDevTool,
} from './provider-composition';
export type { ProviderComponent, ProviderConfig } from './provider-composition';

export { createProvider } from './provider-factory';
export type { ProviderFactoryResult } from './provider-factory';

export {
  createSafeContext,
  useContextSelector,
  useContextFactory,
} from './context-utilities';
