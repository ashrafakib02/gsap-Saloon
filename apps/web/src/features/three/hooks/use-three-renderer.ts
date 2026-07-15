/**
 * useThreeRenderer — Renderer Configuration and Canvas Settings
 *
 * Returns the resolved {@link RendererConfig} from context plus the derived
 * GL attributes and declarative canvas settings the {@link ThreeCanvas}
 * wrapper needs. All values are memoized against the context's renderer
 * config — they change only when the quality preset changes.
 *
 * Phase 6.1: React Three Fiber setup — infrastructure only.
 */

import { useMemo } from 'react';

import { useThreeContext } from '../three-context';
import { buildGlAttributes, resolveCanvasSettings } from '../three-renderer';
import type { ThreeCanvasSettings } from '../three-renderer';

import type { RendererConfig } from '../three.types';
import type { ThreeGlAttributes } from '../three-renderer';

// ── Return Type ──────────────────────────────────────────

/**
 * The resolved renderer configuration and derived Canvas settings.
 */
export interface UseThreeRendererReturn {
  /** The raw resolved renderer configuration. */
  readonly config: RendererConfig;
  /** The WebGL context attributes for `<Canvas gl={…}>`. */
  readonly gl: ThreeGlAttributes;
  /** All declarative settings the Canvas wrapper passes to `<Canvas>`. */
  readonly canvasSettings: ThreeCanvasSettings;
}

// ── Hook ─────────────────────────────────────────────────

/**
 * Access the resolved renderer configuration and derived Canvas settings.
 *
 * Must be used within a {@link ThreeProvider}. Returns memoized values
 * that change only when the active quality preset changes.
 *
 * @example
 * ```tsx
 * function RendererInfo() {
 *   const { config } = useThreeRenderer();
 *   return <span>Exposure: {config.toneMappingExposure}</span>;
 * }
 * ```
 */
export function useThreeRenderer(): UseThreeRendererReturn {
  const ctx = useThreeContext();

  const config = useMemo(
    () => ctx.renderer,
    [ctx.renderer],
  );

  const gl = useMemo(
    () => buildGlAttributes(config),
    [config],
  );

  const canvasSettings = useMemo(
    () =>
      resolveCanvasSettings(
        ctx.quality,
        ctx.capabilities.pixelRatio,
      ),
    [ctx.quality, ctx.capabilities.pixelRatio],
  );

  return useMemo(
    () => ({ config, gl, canvasSettings }),
    [config, gl, canvasSettings],
  );
}
