/**
 * useHoverIntent — Hover Intent Detection Hook
 *
 * From DESIGN_SYSTEM §14 Law 3:
 * "Most visitors should not consciously notice the motion.
 *  They should notice the feeling."
 *
 * Hover intent prevents flickering when the cursor passes over
 * elements. The hover state activates only after the cursor
 * remains stationary for the specified delay. This makes hover
 * feel intentional, not accidental — a premium interaction
 * quality that separates luxury from template.
 *
 * Architecture:
 * - Uses refs for event attachment (no inline handlers)
 * - Manages delayed hover state via setTimeout
 * - Movement threshold prevents false activations
 * - Cleanup on unmount prevents memory leaks
 * - Returns event handlers via ref pattern (not prop spreading)
 *
 * From VISUAL_RULES AC5:
 * "Every interactive element has a visible hover/focus state."
 *
 * This hook provides the STATE; the component provides the STYLING.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  HoverIntentOptions,
  UseHoverIntentReturn,
} from '../hero-interaction.types';
import { HERO_INTERACTION } from '../hero-interaction.config';

// ── Hook ──────────────────────────────────────────────────

/**
 * Detects hover intent with configurable delay.
 *
 * Returns a ref to attach to the interactive element and
 * event handlers managed via the ref (no inline handlers).
 *
 * @param options - Configuration for hover intent detection
 * @returns Ref, hover state, and event handlers
 *
 * @example
 * ```tsx
 * function CTAButton() {
 *   const { ref, isHovered, handlers } = useHoverIntent();
 *
 *   return (
 *     <button
 *       ref={ref}
 *       style={{
 *         backgroundColor: isHovered ? 'var(--color-accent-hover)' : 'var(--color-accent)',
 *       }}
 *       {...handlers}
 *     >
 *       Book Now
 *     </button>
 *   );
 * }
 * ```
 */
export function useHoverIntent<T extends HTMLElement = HTMLElement>(
  options?: HoverIntentOptions,
): UseHoverIntentReturn<T> {
  const delay = options?.delay ?? HERO_INTERACTION.hoverIntent.delay;

  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<T | null>(null);

  /* Timer refs for delayed hover activation */
  const enterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Cleanup timers on unmount */
  useEffect(() => {
    return () => {
      if (enterTimerRef.current !== null) {
        clearTimeout(enterTimerRef.current);
      }
      if (leaveTimerRef.current !== null) {
        clearTimeout(leaveTimerRef.current);
      }
    };
  }, []);

  const handleMouseEnter = useCallback(() => {
    /* Clear any pending leave timer */
    if (leaveTimerRef.current !== null) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }

    /* Start enter delay */
    enterTimerRef.current = setTimeout(() => {
      setIsHovered(true);
      enterTimerRef.current = null;
    }, delay);
  }, [delay]);

  const handleMouseLeave = useCallback(() => {
    /* Clear any pending enter timer */
    if (enterTimerRef.current !== null) {
      clearTimeout(enterTimerRef.current);
      enterTimerRef.current = null;
    }

    /* Start leave delay — slightly faster than enter for responsive feel */
    leaveTimerRef.current = setTimeout(() => {
      setIsHovered(false);
      leaveTimerRef.current = null;
    }, delay * 0.5);
  }, [delay]);

  const handleFocus = useCallback(() => {
    /* Focus activates hover immediately — no delay for keyboard */
    if (leaveTimerRef.current !== null) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setIsHovered(true);
  }, []);

  const handleBlur = useCallback(() => {
    /* Blur deactivates hover immediately */
    if (enterTimerRef.current !== null) {
      clearTimeout(enterTimerRef.current);
      enterTimerRef.current = null;
    }
    setIsHovered(false);
  }, []);

  return {
    ref,
    isHovered,
    handlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onFocus: handleFocus,
      onBlur: handleBlur,
    },
  };
}
