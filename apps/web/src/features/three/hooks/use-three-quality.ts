/**
 * useThreeQuality — Quality Settings and Override API
 *
 * Returns the active {@link QualitySettings} and convenience derived values
 * (preset, post-processing, shadows, frameloop). Also re-exports the
 * quality override function for callers that need to explicitly set or
 * reset the quality preset.
 *
 * Phase 6.1: React Three Fiber setup — infrastructure only.
 */

import { useMemo } from 'react';

import { useThreeContext } from '../three-context';

import type {
  QualitySettings,
  QualityPreset,
  FrameloopMode,
} from '../three.types';

// ── Return Type ──────────────────────────────────────────

/**
 * The resolved quality configuration and derived convenience values.
 */
export interface UseThreeQualityReturn {
  /** The full quality settings object. */
  readonly settings: QualitySettings;
  /** The active quality preset label. */
  readonly preset: QualityPreset;
  /** Whether post-processing is permitted at this preset. */
  readonly canPostProcess: boolean;
  /** Whether shadows are permitted at this preset. */
  readonly canShadow: boolean;
  /** The recommended frameloop mode for this preset. */
  readonly recommendedFrameloop: FrameloopMode;
  /** Whether the preset was auto-derived (`true`) or set explicitly (`false`). */
  readonly derived: boolean;
  /** Explicitly override the active quality preset, or `null` to re-derive. */
  readonly setPreset: (preset: QualityPreset | null) => void;
}

// ── Hook ─────────────────────────────────────────────────

/**
 * Access the active quality settings and override API.
 *
 * Must be used within a {@link ThreeProvider}. All returned values are
 * memoized — they change only when the quality preset changes.
 *
 * @example
 * ```tsx
 * function QualityInfo() {
 *   const { preset, canShadow, setPreset } = useThreeQuality();
 *   return (
 *     <div>
 *       <span>{preset}</span>
 *       <button onClick={() => setPreset('low')}>Lower quality</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useThreeQuality(): UseThreeQualityReturn {
  const ctx = useThreeContext();

  const settings = useMemo(() => ctx.quality, [ctx.quality]);

  const preset = useMemo(() => settings.preset, [settings]);

  const canPostProcess = useMemo(
    () => settings.postProcessingEnabled,
    [settings.postProcessingEnabled],
  );

  const canShadow = useMemo(
    () => settings.shadowsEnabled,
    [settings.shadowsEnabled],
  );

  const recommendedFrameloop = useMemo(
    () => settings.frameloop,
    [settings.frameloop],
  );

  const derived = useMemo(() => settings.derived, [settings.derived]);

  return useMemo<UseThreeQualityReturn>(
    () => ({
      settings,
      preset,
      canPostProcess,
      canShadow,
      recommendedFrameloop,
      derived,
      setPreset: ctx.setQualityPreset,
    }),
    [
      settings,
      preset,
      canPostProcess,
      canShadow,
      recommendedFrameloop,
      derived,
      ctx.setQualityPreset,
    ],
  );
}
