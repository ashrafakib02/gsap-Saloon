/**
 * HeroInteractionContext — Hero Interaction State Provider
 *
 * From DESIGN_SYSTEM §18 (State Philosophy):
 * "Every interactive element exists in multiple states.
 *  Without a defined state philosophy, each element invents
 *  its own state behavior."
 *
 * From DESIGN_SYSTEM §16 (Naming):
 * "Context names describe the data they provide, not the component
 *  that provides them."
 *
 * Architecture:
 * - Provides interaction mode, focus visibility, hover availability
 * - Provides GSAP context ref for future animation integration
 * - Provides animation target registration for Phase 9
 * - Wraps the hero section <section> element
 * - Sub-components consume via useHeroInteractionContext()
 *
 * From VISUAL_RULES AC5:
 * "prefers-reduced-motion is always respected."
 *
 * The provider bridges the interaction hook with the component tree.
 * It does NOT create animations — it provides the STATE that
 * animations will consume in Phase 9.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type {
  HeroInteractionContextValue,
  InteractionMode,
} from './hero-interaction.types';

// ── Context ───────────────────────────────────────────────

/**
 * The interaction context.
 *
 * Undefined default — the provider MUST wrap the hero section.
 * If a sub-component tries to use this without a provider,
 * the error will be clear and immediate.
 */
const HeroInteractionContext =
  createContext<HeroInteractionContextValue | null>(null);

// ── Provider Props ────────────────────────────────────────

interface HeroInteractionProviderProps {
  children: ReactNode;
  /** Whether reduced motion is preferred (from viewport hook) */
  prefersReducedMotion: boolean;
}

// ── Provider ──────────────────────────────────────────────

/**
 * Provides hero interaction state to all sub-components.
 *
 * This provider wraps the hero <section> element and:
 * 1. Detects interaction mode (keyboard/pointer/touch)
 * 2. Manages focus ring visibility
 * 3. Provides GSAP context for future animations
 * 4. Registers animation targets
 * 5. Cleans up on unmount
 *
 * From EXPERIENCE_STORYBOARD SCENE 1:
 * "The hero is the entrance. Everything else is discovered."
 *
 * The interaction state must be established at the hero level
 * so that all sub-components (CTAs, scroll indicator, etc.)
 * share a consistent view of HOW the user is interacting.
 */
export function HeroInteractionProvider({
  children,
  prefersReducedMotion,
}: HeroInteractionProviderProps) {
  /* ── Interaction Mode State ───────────────────────────── */
  const [interactionMode, setInteractionMode] =
    useState<InteractionMode>('none');
  const modeRef = useRef<InteractionMode>('none');

  /* ── GSAP Integration Refs (Phase 9 preparation) ──────── */
  const gsapContextRef = useRef<unknown | null>(null);
  const animationTargetRefs = useRef<
    Map<string, React.RefObject<HTMLElement | null>>
  >(new Map());

  /* ── Mode Upgrade Logic ──────────────────────────────────
   *
   * Mode can only upgrade, never downgrade:
   * none → keyboard → pointer/touch
   */
  const upgradeMode = useCallback((newMode: InteractionMode) => {
    if (modeRef.current === 'none') {
      modeRef.current = newMode;
      setInteractionMode(newMode);
    } else if (modeRef.current === 'keyboard' && newMode !== 'keyboard') {
      modeRef.current = newMode;
      setInteractionMode(newMode);
    }
  }, []);

  /* ── Global Event Listeners ────────────────────────────────
   *
   * Uses global event listeners via useEffect to detect
   * interaction mode. This is the correct pattern for a
   * provider that doesn't own a DOM element — it wraps
   * children, not a specific node.
   *
   * Listeners are passive and never preventDefault.
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        upgradeMode('keyboard');
        return;
      }
      if (e.key === 'Enter' || e.key === ' ') {
        upgradeMode('keyboard');
      }
    };

    const handlePointerDown = () => {
      upgradeMode('pointer');
    };

    const handleTouchStart = () => {
      upgradeMode('touch');
    };

    document.addEventListener('keydown', handleKeyDown, { passive: true });
    document.addEventListener('pointerdown', handlePointerDown, { passive: true });
    document.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, [upgradeMode]);

  /* ── Animation Target Registration ──────────────────────── */
  const registerAnimationTarget = useCallback(
    (key: string, ref: React.RefObject<HTMLElement | null>) => {
      animationTargetRefs.current.set(key, ref);
    },
    [],
  );

  /* ── Derived State ──────────────────────────────────────── */
  const showFocusRing = interactionMode === 'keyboard';
  const supportsHover =
    interactionMode !== 'touch' && interactionMode !== 'none';
  const isTouch = interactionMode === 'touch';

  /* ── Cleanup Lifecycle ──────────────────────────────────── */
  useEffect(() => {
    return () => {
      gsapContextRef.current = null;
      animationTargetRefs.current.clear();
    };
  }, []);

  /* ── Context Value ────────────────────────────────────────
   * Memoized to prevent unnecessary re-renders of all consumers.
   * Only recreates when interaction mode or preferences change.
   * animationTargetRefs is a ref — its .current is stable. */
  const value: HeroInteractionContextValue = useMemo(
    () => ({
      interactionMode,
      showFocusRing,
      supportsHover,
      isTouch,
      prefersReducedMotion,
      gsapContextRef,
      animationTargetRefs: animationTargetRefs.current,
      registerAnimationTarget,
    }),
    [
      interactionMode,
      showFocusRing,
      supportsHover,
      isTouch,
      prefersReducedMotion,
      registerAnimationTarget,
    ],
  );

  return (
    <HeroInteractionContext.Provider value={value}>
      {children}
    </HeroInteractionContext.Provider>
  );
}

// ── Consumer Hook ─────────────────────────────────────────

/**
 * Access hero interaction context from sub-components.
 *
 * From DESIGN_SYSTEM §16:
 * "Context names describe the data they provide."
 *
 * @throws Error if used outside HeroInteractionProvider
 * @returns The hero interaction context value
 */
export function useHeroInteractionContext(): HeroInteractionContextValue {
  const context = useContext(HeroInteractionContext);

  if (context === null) {
    throw new Error(
      'useHeroInteractionContext must be used within a HeroInteractionProvider. ' +
        'Wrap the hero section with <HeroInteractionProvider>.',
    );
  }

  return context;
}
