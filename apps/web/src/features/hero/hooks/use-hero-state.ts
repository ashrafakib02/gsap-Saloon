/**
 * useHeroState — Hero State Management Hook
 *
 * From PROJECT_BLUEPRINT §State Inventory:
 * "Local State: Image loadStatus — 'idle' | 'loading' | 'loaded' | 'error'"
 *
 * From EXPERIENCE_STORYBOARD SCENE 0:
 * "The loading moment is the journey from their world to ours."
 *
 * This hook manages the hero's complete state lifecycle:
 * 1. Load state tracking (idle → loading → loaded/error)
 * 2. Animation state tracking (waiting → revealing → revealed)
 * 3. Readiness computation (hero is ready when loaded + animation complete)
 * 4. Retry capability (for error recovery)
 *
 * Architecture:
 * - Pure React state (no Redux — hero state is local, not global)
 * - From PROJECT_BLUEPRINT §State Inventory:
 *   "Local State: Image loadStatus — Component-level"
 * - Follows the hook returning object pattern (DESIGN_SYSTEM §11.3)
 */

import { useState, useCallback, useRef } from 'react';
import type { HeroLoadState, HeroAnimationState } from '../hero.types';

// ── Return Type ───────────────────────────────────────────

export interface UseHeroStateReturn {
  /** Current image load state */
  loadState: HeroLoadState;
  /** Current animation state */
  animationState: HeroAnimationState;
  /** Whether the hero is fully ready (loaded + revealed) */
  isReady: boolean;
  /** Whether the hero is in its initial loading phase */
  isLoading: boolean;
  /** Mark the image as loading */
  startLoading: () => void;
  /** Mark the image as loaded */
  markLoaded: () => void;
  /** Mark the image as errored */
  markError: (error: Error) => void;
  /** Mark the animation as started */
  startReveal: () => void;
  /** Mark the animation as complete */
  markRevealed: () => void;
  /** Reset to initial state (for retry) */
  reset: () => void;
  /** The error that occurred, if any */
  error: Error | null;
}

// ── Hook ──────────────────────────────────────────────────

/**
 * Manages the hero's complete state lifecycle.
 *
 * State machine:
 *
 *   idle → loading → loaded → revealing → revealed
 *              ↓         ↓
 *            error     (retry → loading)
 *
 * From DESIGN_SYSTEM §18 (State Philosophy):
 * "Every interactive element exists in multiple states.
 *  Without a defined state philosophy, each element invents
 *  its own state behavior."
 *
 * The hero is the most important "element" on the page.
 * Its state must be managed with precision.
 */
export function useHeroState(): UseHeroStateReturn {
  const [loadState, setLoadState] = useState<HeroLoadState>('idle');
  const [animationState, setAnimationState] =
    useState<HeroAnimationState>('waiting');
  const [error, setError] = useState<Error | null>(null);

  /* Track retry count for debugging */
  const retryCount = useRef(0);

  const startLoading = useCallback(() => {
    setLoadState('loading');
    setError(null);
  }, []);

  const markLoaded = useCallback(() => {
    setLoadState('loaded');
  }, []);

  const markError = useCallback((err: Error) => {
    setLoadState('error');
    setError(err);
  }, []);

  const startReveal = useCallback(() => {
    setAnimationState('revealing');
  }, []);

  const markRevealed = useCallback(() => {
    setAnimationState('revealed');
  }, []);

  const reset = useCallback(() => {
    retryCount.current += 1;
    setLoadState('idle');
    setAnimationState('waiting');
    setError(null);
  }, []);

  /* Derived states */
  const isReady = loadState === 'loaded' && animationState === 'revealed';
  const isLoading = loadState === 'idle' || loadState === 'loading';

  return {
    loadState,
    animationState,
    isReady,
    isLoading,
    startLoading,
    markLoaded,
    markError,
    startReveal,
    markRevealed,
    reset,
    error,
  };
}
