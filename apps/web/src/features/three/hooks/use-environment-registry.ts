/**
 * useEnvironmentRegistry — Read-Only Environment Registry Access
 *
 * Provides read-only query methods over the environment registries.
 * All methods are derived from the snapshot — they are pure lookups.
 *
 * Phase 6.6: Environment architecture — infrastructure only, no rendering.
 */

import { useMemo } from 'react';

import { environmentManager } from '../environment-manager';
import { useEnvironmentContext } from '../environment-provider';

/**
 * Return type — all read-only registry query methods.
 */
export interface UseEnvironmentRegistryReturn {
  /** Get a preset's runtime state by ID. */
  readonly getPreset: ReturnType<typeof environmentManager.getRegistry>['getPreset'];
  /** Get a category's runtime state by ID. */
  readonly getCategory: ReturnType<typeof environmentManager.getRegistry>['getCategory'];
  /** Get a group's runtime state by ID. */
  readonly getGroup: ReturnType<typeof environmentManager.getRegistry>['getGroup'];
  /** All registered preset IDs. */
  readonly getPresetIds: ReturnType<typeof environmentManager.getRegistry>['getPresetIds'];
  /** All registered category IDs. */
  readonly getCategoryIds: ReturnType<typeof environmentManager.getRegistry>['getCategoryIds'];
  /** All registered group IDs. */
  readonly getGroupIds: ReturnType<typeof environmentManager.getRegistry>['getGroupIds'];
  /** Whether a preset is registered. */
  readonly hasPreset: ReturnType<typeof environmentManager.getRegistry>['hasPreset'];
  /** Whether a category is registered. */
  readonly hasCategory: ReturnType<typeof environmentManager.getRegistry>['hasCategory'];
  /** Whether a group is registered. */
  readonly hasGroup: ReturnType<typeof environmentManager.getRegistry>['hasGroup'];
  /** Total registered preset count. */
  readonly presetCount: ReturnType<typeof environmentManager.getRegistry>['presetCount'];
  /** Total registered category count. */
  readonly categoryCount: ReturnType<typeof environmentManager.getRegistry>['categoryCount'];
  /** Total registered group count. */
  readonly groupCount: ReturnType<typeof environmentManager.getRegistry>['groupCount'];
  /** Get all enabled presets. */
  readonly getEnabledPresets: ReturnType<typeof environmentManager.getRegistry>['getEnabledPresets'];
  /** Get all enabled categories. */
  readonly getEnabledCategories: ReturnType<typeof environmentManager.getRegistry>['getEnabledCategories'];
  /** Get all enabled groups. */
  readonly getEnabledGroups: ReturnType<typeof environmentManager.getRegistry>['getEnabledGroups'];
}

/**
 * Access the read-only environment registry.
 *
 * Returns memoized query methods derived from the environment-manager's
 * registry. All methods are stable — they never change identity.
 *
 * Must be used within an {@link EnvironmentRoot}.
 *
 * @example
 * ```tsx
 * function EnvironmentCount() {
 *   const registry = useEnvironmentRegistry();
 *   return <span>Presets: {registry.presetCount()}</span>;
 * }
 * ```
 */
export function useEnvironmentRegistry(): UseEnvironmentRegistryReturn {
  /* Confirm the provider is mounted. */
  useEnvironmentContext();

  const registry = environmentManager.getRegistry();

  return useMemo<UseEnvironmentRegistryReturn>(
    () => ({
      getPreset: registry.getPreset,
      getCategory: registry.getCategory,
      getGroup: registry.getGroup,
      getPresetIds: registry.getPresetIds,
      getCategoryIds: registry.getCategoryIds,
      getGroupIds: registry.getGroupIds,
      hasPreset: registry.hasPreset,
      hasCategory: registry.hasCategory,
      hasGroup: registry.hasGroup,
      presetCount: registry.presetCount,
      categoryCount: registry.categoryCount,
      groupCount: registry.groupCount,
      getEnabledPresets: registry.getEnabledPresets,
      getEnabledCategories: registry.getEnabledCategories,
      getEnabledGroups: registry.getEnabledGroups,
    }),
    [registry],
  );
}
