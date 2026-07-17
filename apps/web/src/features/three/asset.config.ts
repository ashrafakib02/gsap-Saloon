/**
 * Asset Config — Pure Derivation Functions for Asset Pipeline
 *
 * This module contains pure derivation logic that turns quality presets
 * and reduced-motion state into asset-specific budgets, constraints,
 * and validation. It performs no state management and has no side effects.
 *
 * Phase 6.7: Asset Pipeline — infrastructure only.
 */

import type {
  AssetCategory,
  AssetPriority,
  AssetState,
  AssetQualityProfile,
  AssetConstraints,
  AssetDefinition,
} from './asset.types';

import type { QualityPreset } from './three.types';

import { ASSET_CATEGORIES, ASSET_PRIORITIES } from './asset.types';

import {
  ASSET_QUALITY_PROFILES,
  DEFAULT_ASSET_CONSTRAINTS,
  REDUCED_MOTION_ASSET_CONSTRAINTS,
  ASSET_STATE_ORDER,
  ASSET_PRIORITY_ORDER,
} from './asset.constants';

/* -------------------------------------------------------------------------- */
/*                              Type Guards                                    */
/* -------------------------------------------------------------------------- */

/** Type guard: is a string a valid {@link AssetCategory}? */
export function isAssetCategory(value: unknown): value is AssetCategory {
  return (
    typeof value === 'string' &&
    (ASSET_CATEGORIES as readonly string[]).includes(value)
  );
}

/** Type guard: is a string a valid {@link AssetPriority}? */
export function isAssetPriority(value: unknown): value is AssetPriority {
  return (
    typeof value === 'string' &&
    (ASSET_PRIORITIES as readonly string[]).includes(value)
  );
}

/** Type guard: is a string a valid {@link AssetState}? */
export function isAssetState(value: unknown): value is AssetState {
  return typeof value === 'string' && value in ASSET_STATE_ORDER;
}

/* -------------------------------------------------------------------------- */
/*                         Quality Profile Derivation                         */
/* -------------------------------------------------------------------------- */

/**
 * Derive the quality-adapted asset profile for a quality preset.
 *
 * Returns a frozen {@link AssetQualityProfile} derived from the active
 * quality preset. Higher presets enable more features and higher budgets.
 */
export function deriveAssetQualityProfile(
  preset: QualityPreset,
): AssetQualityProfile {
  return ASSET_QUALITY_PROFILES[preset];
}

/* -------------------------------------------------------------------------- */
/*                          Constraint Derivation                             */
/* -------------------------------------------------------------------------- */

/**
 * Derive asset constraints for the current quality and motion state.
 *
 * Reduced motion tightens all budgets significantly — fewer concurrent
 * loads, smaller memory budget, shallower dependency chains.
 */
export function deriveAssetConstraints(
  _qualityProfile: AssetQualityProfile | undefined,
  isReducedMotion: boolean,
): AssetConstraints {
  if (isReducedMotion) {
    return REDUCED_MOTION_ASSET_CONSTRAINTS;
  }
  return DEFAULT_ASSET_CONSTRAINTS;
}

/* -------------------------------------------------------------------------- */
/*                        Preset Defaults                                     */
/* -------------------------------------------------------------------------- */

/** Resolve default category for a definition (from category resolution). */
export function resolveAssetCategory(
  _definitionId: string,
): AssetCategory {
  return 'models';
}

/** Resolve default priority for a definition. */
export function resolveAssetPriority(
  _definitionId: string,
): AssetPriority {
  return 'normal';
}

/* -------------------------------------------------------------------------- */
/*                         Dependency Validation                              */
/* -------------------------------------------------------------------------- */

/**
 * Validate that no circular dependencies exist in a set of asset definitions.
 *
 * Uses DFS-based cycle detection on the dependency graph.
 * Returns `true` if no cycles exist.
 */
export function validateDependencyGraph(
  definitions: readonly AssetDefinition[],
): boolean {
  const graph = new Map<string, readonly string[]>();
  for (const def of definitions) {
    graph.set(def.id, def.dependencies);
  }

  const WHITE = 0; // unvisited
  const GRAY = 1;  // in current DFS path
  const BLACK = 2; // fully explored

  const color = new Map<string, number>();
  for (const id of graph.keys()) {
    color.set(id, WHITE);
  }

  function dfs(node: string): boolean {
    color.set(node, GRAY);
    const deps = graph.get(node) ?? [];
    for (const dep of deps) {
      const depColor = color.get(dep) ?? WHITE;
      if (depColor === GRAY) return false; // cycle detected
      if (depColor === WHITE) {
        if (!dfs(dep)) return false;
      }
    }
    color.set(node, BLACK);
    return true;
  }

  for (const id of graph.keys()) {
    if ((color.get(id) ?? WHITE) === WHITE) {
      if (!dfs(id)) return false;
    }
  }

  return true;
}

/**
 * Topologically sort asset definitions respecting dependency order.
 *
 * Assets with no dependencies come first. Dependencies are guaranteed
 * to appear before their dependents.
 */
export function topologicalSort(
  definitions: readonly AssetDefinition[],
): readonly string[] {
  const graph = new Map<string, readonly string[]>();
  for (const def of definitions) {
    graph.set(def.id, def.dependencies);
  }

  const visited = new Set<string>();
  const result: string[] = [];

  function visit(id: string): void {
    if (visited.has(id)) return;
    visited.add(id);
    const deps = graph.get(id) ?? [];
    for (const dep of deps) {
      visit(dep);
    }
    result.push(id);
  }

  for (const id of graph.keys()) {
    visit(id);
  }

  return result;
}

/* -------------------------------------------------------------------------- */
/*                        Priority Clamping                                   */
/* -------------------------------------------------------------------------- */

/**
 * Clamp a priority downward (toward lower priority).
 *
 * Returns whichever of two priorities is lower in the priority order.
 * Higher {@link ASSET_PRIORITY_ORDER} index = lower priority.
 */
export function clampPriorityDown(
  priority: AssetPriority,
  floor: AssetPriority,
): AssetPriority {
  return ASSET_PRIORITY_ORDER[priority] >= ASSET_PRIORITY_ORDER[floor]
    ? priority
    : floor;
}
