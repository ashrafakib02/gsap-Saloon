/**
 * Scene Stage — Registers a Scene and Gates Children by Stage
 *
 * From TECHNICAL_ARCHITECTURE §9.2:
 * "Scenes register with the 3D root so the engine can coordinate lifecycle,
 *  disposal, and quality scaling centrally."
 *
 * This component registers a scene with the scene-manager on mount,
 * transitions it to the specified stage, and renders children only when
 * the scene's visibility is 'visible'. Unregisters the scene on unmount.
 *
 * Phase 6.2: Scene architecture — infrastructure only, no 3D objects.
 */

import { useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';

import { useSceneContext } from './scene-provider';

import type {
  SceneStage,
  SceneOptions,
  SceneVisibility,
  SceneLayerId,
  ScenePriority,
  SceneGroup,
} from './scene.types';

// ── Props ──────────────────────────────────────────────────

interface SceneStageProps {
  /** Unique scene identifier. */
  readonly sceneId: string;
  /** The lifecycle stage to register this scene with. */
  readonly stage: SceneStage;
  /** Render-order layer this scene occupies. */
  readonly layer?: SceneLayerId;
  /** Resource allocation priority. */
  readonly priority?: ScenePriority;
  /** Logical group for lifecycle coordination. */
  readonly group?: SceneGroup;
  /** Human-readable name for debug output. */
  readonly label?: string;
  /** Content rendered when the scene is visible. */
  readonly children: ReactNode;
  /** Content rendered when the scene is not visible. */
  readonly fallback?: ReactNode;
}

// ── Component ──────────────────────────────────────────────

/**
 * Registers a scene and gates its children by visibility.
 *
 * The scene is registered on mount and unregistered on unmount. Children
 * render only when the derived visibility is 'visible'. The fallback
 * renders otherwise.
 *
 * @example
 * ```tsx
 * <SceneStage
 *   sceneId="hero-atmosphere"
 *   stage="active"
 *   layer="effects"
 *   priority="critical"
 *   group="hero"
 * >
 *   <ParticleEffect />
 * </SceneStage>
 * ```
 */
export function SceneStage({
  sceneId,
  stage,
  layer,
  priority,
  group,
  label,
  children,
  fallback = null,
}: SceneStageProps) {
  const { sceneManager, snapshot } = useSceneContext();

  // ── Register / unregister ─────────────────────────────

  useEffect(() => {
    const options: SceneOptions = {
      id: sceneId,
      stage,
      layer,
      priority,
      group,
      label,
    };
    sceneManager.registerScene(options);

    return () => {
      sceneManager.unregisterScene(sceneId);
    };
  }, [sceneId, stage, layer, priority, group, label, sceneManager]);

  // ── Transition stage when prop changes ─────────────────

  useEffect(() => {
    sceneManager.setSceneStage(sceneId, stage);
  }, [sceneId, stage, sceneManager]);

  // ── Derive visibility ─────────────────────────────────

  const sceneState = snapshot.scenes.get(sceneId);
  const visibility: SceneVisibility = sceneState?.visibility ?? 'hidden';

  // ── Gate children ─────────────────────────────────────

  const shouldRender = useMemo(
    () => visibility === 'visible',
    [visibility],
  );

  return <>{shouldRender ? children : fallback}</>;
}
