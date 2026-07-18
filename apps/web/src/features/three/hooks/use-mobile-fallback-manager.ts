/**
 * useMobileFallbackManager — Direct Access to Mobile Fallback Manager Methods
 *
 * Provides a stable, memoized reference to the mobile-fallback-manager's
 * mutation methods. All returned functions are bound to the singleton and
 * never change identity — safe for use in effect dependencies and callbacks.
 *
 * Phase 6.9: Mobile Fallback — architecture only, no runtime switching.
 */

import { useMemo } from 'react';

import { mobileFallbackManager } from '../mobile-fallback-manager';
import { useMobileFallbackContext } from '../mobile-fallback-provider';

/**
 * Return type — all readonly mutation methods on the mobile fallback manager.
 */
export interface UseMobileFallbackManagerReturn {
  readonly setActiveProfile: typeof mobileFallbackManager.setActiveProfile;
  readonly getActiveProfile: typeof mobileFallbackManager.getActiveProfile;
  readonly registerProfile: typeof mobileFallbackManager.registerProfile;
  readonly registerRule: typeof mobileFallbackManager.registerRule;
  readonly unregisterRule: typeof mobileFallbackManager.unregisterRule;
  readonly registerFeatureFlag: typeof mobileFallbackManager.registerFeatureFlag;
  readonly unregisterFeatureFlag: typeof mobileFallbackManager.unregisterFeatureFlag;
  readonly registerCompatibility: typeof mobileFallbackManager.registerCompatibility;
  readonly unregisterCompatibility: typeof mobileFallbackManager.unregisterCompatibility;
  readonly evaluate: typeof mobileFallbackManager.evaluate;
  readonly getRegistry: typeof mobileFallbackManager.getRegistry;
  readonly setReducedMotion: typeof mobileFallbackManager.setReducedMotion;
}

/**
 * Access memoized mobile-fallback-manager methods.
 *
 * Must be used within a {@link MobileFallbackRoot}. Returns a stable object
 * whose methods never change identity — safe for effect deps and callbacks.
 *
 * @example
 * ```tsx
 * function MobileControls() {
 *   const { setActiveProfile, registerRule } = useMobileFallbackManager();
 *
 *   const handleProfileChange = useCallback(() => {
 *     setActiveProfile('medium');
 *   }, [setActiveProfile]);
 *
 *   return <button onClick={handleProfileChange}>Set Medium</button>;
 * }
 * ```
 */
export function useMobileFallbackManager(): UseMobileFallbackManagerReturn {
  /* Confirm the provider is mounted. */
  useMobileFallbackContext();

  return useMemo<UseMobileFallbackManagerReturn>(
    () => ({
      setActiveProfile: mobileFallbackManager.setActiveProfile,
      getActiveProfile: mobileFallbackManager.getActiveProfile,
      registerProfile: mobileFallbackManager.registerProfile,
      registerRule: mobileFallbackManager.registerRule,
      unregisterRule: mobileFallbackManager.unregisterRule,
      registerFeatureFlag: mobileFallbackManager.registerFeatureFlag,
      unregisterFeatureFlag: mobileFallbackManager.unregisterFeatureFlag,
      registerCompatibility: mobileFallbackManager.registerCompatibility,
      unregisterCompatibility: mobileFallbackManager.unregisterCompatibility,
      evaluate: mobileFallbackManager.evaluate,
      getRegistry: mobileFallbackManager.getRegistry,
      setReducedMotion: mobileFallbackManager.setReducedMotion,
    }),
    [],
  );
}
