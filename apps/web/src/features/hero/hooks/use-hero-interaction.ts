/**
 * useHeroInteraction — Hero Interaction State Hook
 *
 * From DESIGN_SYSTEM §18 (State Philosophy):
 * "Every interactive element exists in multiple states.
 *  Without a defined state philosophy, each element invents
 *  its own state behavior."
 *
 * This hook is the SINGLE source of truth for hero interaction state.
 * It detects HOW the user is interacting (keyboard/pointer/touch)
 * and provides the state and event handlers that sub-components need.
 *
 * Architecture:
 * - Interaction mode detection (keyboard → pointer → touch)
 * - Focus ring visibility (keyboard-only, never mouse)
 * - Hover state availability (pointer-only, never touch)
 * - GSAP context preparation (refs only, no animations)
 * - Animation target registration (for Phase 9)
 * - Cleanup lifecycle (all timers, refs cleaned on unmount)
 *
 * From VISUAL_RULES:
 * - AC5: "Every interactive element has a visible hover/focus state"
 * - A9: "Touch targets are minimum 44×44px"
 * - A5: "Every interactive element has a visible hover/focus state"
 *
 * This hook does NOT create animations. It PREPARES the
 * infrastructure that Phase 9 (Motion Polish) will use.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  InteractionMode,
  UseHeroInteractionReturn,
} from '../hero-interaction.types';

// ── Hook ──────────────────────────────────────────────────

/**
 * Manages the complete interaction state for the hero section.
 *
 * Interaction mode detection:
 * 1. Starts as 'none' — no interaction detected yet
 * 2. On first Tab/keyboard event → mode = 'keyboard'
 * 3. On first pointer event → mode = 'pointer'
 * 4. On first touch event → mode = 'touch'
 *
 * Once set, the mode can only be upgraded (none → keyboard → pointer/touch),
 * never downgraded. This prevents confusing state changes during use.
 *
 * Focus ring visibility:
 * - Keyboard mode → visible (AC12)
 * - Pointer mode → hidden (mouse users don't need focus rings)
 * - Touch mode → hidden (touch users don't use keyboard)
 *
 * Hover availability:
 * - Pointer mode → yes
 * - Keyboard mode → yes (for focus-based hover)
 * - Touch mode → no (hover is meaningless on touch)
 *
 * @param prefersReducedMotion - Whether the user prefers reduced motion
 * @returns Complete interaction state and handlers
 */
export function useHeroInteraction(
  prefersReducedMotion: boolean,
): UseHeroInteractionReturn {
  const [interactionMode, setInteractionMode] =
    useState<InteractionMode>('none');

  /* ── Interaction Mode Detection ───────────────────────────
   *
   * Uses a ref-based approach to track whether we've already
   * detected an interaction mode. This prevents unnecessary
   * re-renders and ensures the mode is set only once per
   * input method change.
   */
  const modeRef = useRef<InteractionMode>('none');

  /* ── GSAP Integration Refs (Phase 9 preparation) ──────────
   *
   * These refs are established now so that Phase 9 can
   * immediately use them without modifying the provider structure.
   * No GSAP timelines are created — only refs are allocated.
   */
  const gsapContextRef = useRef<unknown | null>(null);
  const animationTargetRefs = useRef<Map<string, React.RefObject<HTMLElement | null>>>(
    new Map(),
  );

  /* ── Mode Upgrade Logic ───────────────────────────────────
   *
   * Mode can only upgrade, never downgrade:
   * none → keyboard → pointer/touch
   *
   * This prevents confusing state changes when, e.g., a user
   * tabs to an element after using the mouse.
   */
  const upgradeMode = useCallback((newMode: InteractionMode) => {
    if (modeRef.current === 'none') {
      modeRef.current = newMode;
      setInteractionMode(newMode);
    } else if (modeRef.current === 'keyboard' && newMode !== 'keyboard') {
      /* Keyboard → pointer/touch is a one-way upgrade */
      modeRef.current = newMode;
      setInteractionMode(newMode);
    }
    /* If already pointer/touch, don't downgrade */
  }, []);

  /* ── Root Event Handlers ──────────────────────────────────
   *
   * These handlers are attached to the hero <section> element.
   * They detect the interaction mode and delegate to sub-components.
   *
   * From VISUAL_RULES AC5:
   * "prefers-reduced-motion is always respected."
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      /* Tab or Shift+Tab → keyboard mode */
      if (e.key === 'Tab') {
        upgradeMode('keyboard');
        return;
      }

      /* Enter or Space → keyboard activation (for CTAs) */
      if (e.key === 'Enter' || e.key === ' ') {
        upgradeMode('keyboard');
        /* Don't prevent default — let the <a> element handle navigation */
      }
    },
    [upgradeMode],
  );

  const handlePointerDown = useCallback(() => {
    upgradeMode('pointer');
  }, [upgradeMode]);

  const handleTouchStart = useCallback(() => {
    upgradeMode('touch');
  }, [upgradeMode]);

  /* ── Focus Ring Visibility ────────────────────────────────
   *
   * Focus rings are visible ONLY in keyboard mode.
   * This is the modern "focus-visible" pattern:
   * - Keyboard navigation → focus ring visible (AC12)
   * - Mouse click → no focus ring (visual noise)
   * - Touch → no focus ring (not applicable)
   */
  const showFocusRing = interactionMode === 'keyboard';

  /* ── Hover Availability ───────────────────────────────────
   *
   * Hover states are available on pointer devices.
   * Touch devices don't have hover — they have tap.
   */
  const supportsHover = interactionMode !== 'touch' && interactionMode !== 'none';

  /* ── Touch Detection ──────────────────────────────────────
   *
   * Touch-primary devices get larger touch targets
   * and no hover-dependent behavior.
   */
  const isTouch = interactionMode === 'touch';

  /* ── Register Animation Target ────────────────────────────
   *
   * Phase 9 will use these refs to create GSAP animations.
   * The registration system is established now so that
   * components can register their DOM elements early.
   */
  const registerAnimationTarget = useCallback(
    (key: string, ref: React.RefObject<HTMLElement | null>) => {
      animationTargetRefs.current.set(key, ref);
    },
    [],
  );

  /* ── Cleanup Lifecycle ────────────────────────────────────
   *
   * Clean up GSAP context on unmount.
   * Phase 9 will populate this with proper GSAP cleanup.
   */
  useEffect(() => {
    return () => {
      /* Phase 9 will implement:
       * if (gsapContextRef.current) {
       *   (gsapContextRef.current as gsap.Context).revert();
       *   gsapContextRef.current = null;
       * }
       */
      gsapContextRef.current = null;
      animationTargetRefs.current.clear();
    };
  }, []);

  return {
    interactionMode,
    showFocusRing,
    supportsHover,
    isTouch,
    prefersReducedMotion,
    rootHandlers: {
      onKeyDown: handleKeyDown,
      onPointerDown: handlePointerDown,
      onTouchStart: handleTouchStart,
    },
    gsapContextRef,
    animationTargetRefs: animationTargetRefs.current,
    registerAnimationTarget,
  };
}
