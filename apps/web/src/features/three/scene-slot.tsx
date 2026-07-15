/**
 * Scene Slot — Registers a Slot and Renders Children When Enabled
 *
 * From TECHNICAL_ARCHITECTURE §9.2:
 * "Scenes, cameras, lights, and assets register with the 3D root so the
 *  engine can coordinate lifecycle, disposal, and quality scaling centrally."
 *
 * Slots are fixed mounting positions for future 3D subsystems (Camera,
 * Lighting, Materials, Particles, Post Processing). This component
 * registers a slot with the scene-manager and renders children when
 * the slot is enabled.
 *
 * Phase 6.2: Scene architecture — infrastructure only, no 3D objects.
 */

import { useMemo } from 'react';
import type { ReactNode } from 'react';

import { useSceneContext } from './scene-provider';

import type { SceneSlotId } from './scene.types';

// ── Props ──────────────────────────────────────────────────

interface SceneSlotProps {
  /** Slot identifier — must match a SceneSlotId. */
  readonly slotId: SceneSlotId;
  /** Content rendered when the slot is enabled. */
  readonly children: ReactNode;
  /** Content rendered when the slot is disabled. */
  readonly fallback?: ReactNode;
}

// ── Component ──────────────────────────────────────────────

/**
 * Registers a slot and renders children when the slot is enabled.
 *
 * Slots are architectural mounting points — they don't create 3D objects.
 * Future subsystems (Camera, Lighting, etc.) will mount inside these slots.
 *
 * @example
 * ```tsx
 * <SceneSlot slotId="camera">
 *   <PerspectiveCamera />
 * </SceneSlot>
 * ```
 */
export function SceneSlot({
  slotId,
  children,
  fallback = null,
}: SceneSlotProps) {
  const { snapshot } = useSceneContext();

  // ── Slot is registered during scene-manager init() ────
  // No explicit registration needed — slots are registered eagerly.

  // ── Derive enabled state from snapshot ────────────────

  const slotState = snapshot.slots.get(slotId);
  const isEnabled = slotState?.enabled ?? false;

  // ── Gate children ─────────────────────────────────────

  const shouldRender = useMemo(() => isEnabled, [isEnabled]);

  return <>{shouldRender ? children : fallback}</>;
}
