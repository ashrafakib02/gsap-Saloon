/**
 * Asset Provider — Context for Asset Pipeline Access
 *
 * From TECHNICAL_ARCHITECTURE §9.2:
 * "Scenes, cameras, lights, and assets register with the 3D root so the
 *  engine can coordinate lifecycle, disposal, and quality scaling centrally."
 *
 * This module creates the AssetContext and provides the useAssetContext
 * accessor. It follows the Fast Refresh compliant pattern — context
 * creation is split from provider JSX so Fast Refresh works.
 *
 * Architecture:
 *   - createContext + useAssetContext accessor (no JSX in this file)
 *   - AssetContextValue interface with manager, snapshot, isEnabled
 *   - Provider component lives in asset-root.tsx
 *
 * Phase 6.7: Asset Pipeline — infrastructure only, no loading.
 */

import { createContext, useContext } from 'react';

import type { AssetManager, AssetSnapshot } from './asset.types';

// ── Context Value ──────────────────────────────────────────

/**
 * The shape of the asset context value.
 *
 * Exposes the singleton manager, the current snapshot, and
 * whether the asset pipeline is enabled.
 */
export interface AssetContextValue {
  /** The singleton asset pipeline manager. */
  readonly manager: AssetManager;
  /** The current immutable asset snapshot. */
  readonly snapshot: AssetSnapshot;
  /** Whether the asset pipeline is enabled. */
  readonly isEnabled: boolean;
  /** Whether reduced-motion is active. */
  readonly isReducedMotion: boolean;
}

// ── Context Creation ───────────────────────────────────────

/**
 * The raw React context for asset state.
 *
 * Defaults to undefined — the provider in asset-root.tsx supplies
 * the real value. Consumer hooks use useAssetContext() to access it.
 */
export const AssetContext = createContext<AssetContextValue | undefined>(
  undefined,
);

/**
 * Accessor for the asset context value.
 *
 * Throws if called outside the AssetRoot provider. All asset
 * hooks must call this to confirm the provider is mounted.
 */
export function useAssetContext(): AssetContextValue {
  const context = useContext(AssetContext);
  if (context === undefined) {
    throw new Error(
      'useAssetContext must be used within an AssetRoot provider. '
      + 'Ensure AssetRoot is mounted in the component tree.',
    );
  }
  return context;
}
