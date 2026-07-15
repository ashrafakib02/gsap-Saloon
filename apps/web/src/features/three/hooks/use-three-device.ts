/**
 * useThreeDevice — Device Capability Access
 *
 * Returns the probed {@link DeviceCapabilities} and derived convenience
 * booleans. Unlike viewport (which is live), capabilities are probed once
 * and frozen — this hook reads from the performance snapshot. The only
 * way to refresh is `refreshCapabilities()` on the provider.
 *
 * Phase 6.1: React Three Fiber setup — infrastructure only.
 */

import { useMemo } from 'react';

import { useThreeContext } from '../three-context';

import type {
  DeviceCapabilities,
  DeviceTier,
  GpuCapability,
} from '../three.types';

// ── Return Type ──────────────────────────────────────────

/**
 * Device capability information and derived convenience values.
 */
export interface UseThreeDeviceReturn {
  /** The full device capability snapshot. */
  readonly capabilities: DeviceCapabilities;
  /** Whether the device can render 3D at all. */
  readonly canRender3D: boolean;
  /** Whether WebGL is supported. */
  readonly hasWebGL: boolean;
  /** Whether WebGL2 is supported. */
  readonly hasWebGL2: boolean;
  /** Whether the device has touch input. */
  readonly isTouch: boolean;
  /** Whether the viewport is below the tablet breakpoint. */
  readonly isMobileViewport: boolean;
  /** Whether the device is classified as high-end. */
  readonly isHighEnd: boolean;
  /** The coarse device performance tier. */
  readonly tier: DeviceTier;
  /** The estimated GPU capability class. */
  readonly gpu: GpuCapability;
  /** The unmasked GPU renderer string, or `null` when unavailable. */
  readonly rendererName: string | null;
  /** Maximum WebGL texture size in texels, or `null` when unavailable. */
  readonly maxTextureSize: number | null;
}

// ── Hook ─────────────────────────────────────────────────

/**
 * Access device capabilities and derived information.
 *
 * Must be used within a {@link ThreeProvider}. All returned values are
 * readonly — capabilities do not change during a session (they are probed
 * once). Use `refreshCapabilities()` from the provider to force a re-probe.
 *
 * @example
 * ```tsx
 * function DeviceInfo() {
 *   const { hasWebGL, tier, gpu } = useThreeDevice();
 *   if (!hasWebGL) return <span>WebGL not supported</span>;
 *   return <span>Tier: {tier}, GPU: {gpu}</span>;
 * }
 * ```
 */
export function useThreeDevice(): UseThreeDeviceReturn {
  const ctx = useThreeContext();

  const capabilities = useMemo(
    () => ctx.capabilities,
    [ctx.capabilities],
  );

  const canRender3D = useMemo(() => ctx.canRender3D, [ctx.canRender3D]);

  const hasWebGL = useMemo(
    () => capabilities.supportsWebGL,
    [capabilities.supportsWebGL],
  );

  const hasWebGL2 = useMemo(
    () => capabilities.supportsWebGL2,
    [capabilities.supportsWebGL2],
  );

  const isTouch = useMemo(
    () => capabilities.isTouch,
    [capabilities.isTouch],
  );

  const isMobileViewport = useMemo(
    () => capabilities.isMobileViewport,
    [capabilities.isMobileViewport],
  );

  const isHighEnd = useMemo(
    () =>
      capabilities.tier === 'desktop-high' ||
      (capabilities.gpu === 'high' &&
        capabilities.tier !== 'low-end' &&
        capabilities.tier !== 'unknown'),
    [capabilities.tier, capabilities.gpu],
  );

  const tier = useMemo(() => capabilities.tier, [capabilities.tier]);
  const gpu = useMemo(() => capabilities.gpu, [capabilities.gpu]);

  const rendererName = useMemo(
    () => capabilities.rendererName,
    [capabilities.rendererName],
  );

  const maxTextureSize = useMemo(
    () => capabilities.maxTextureSize,
    [capabilities.maxTextureSize],
  );

  return useMemo<UseThreeDeviceReturn>(
    () => ({
      capabilities,
      canRender3D,
      hasWebGL,
      hasWebGL2,
      isTouch,
      isMobileViewport,
      isHighEnd,
      tier,
      gpu,
      rendererName,
      maxTextureSize,
    }),
    [
      capabilities,
      canRender3D,
      hasWebGL,
      hasWebGL2,
      isTouch,
      isMobileViewport,
      isHighEnd,
      tier,
      gpu,
      rendererName,
      maxTextureSize,
    ],
  );
}
