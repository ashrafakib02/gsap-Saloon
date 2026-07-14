/**
 * Hero Interaction — Configuration Constants
 *
 * All interaction parameters in one place. No magic numbers in components.
 * Components read from this config; they never hardcode values.
 *
 * From DESIGN_SYSTEM §14 (Motion Principles):
 * "Motion serves content, never decorates it."
 *
 * From DESIGN_SYSTEM §18 (State Philosophy):
 * "State transitions are animated with consistent timing."
 *
 * From VISUAL_RULES:
 * - M6: Maximum hover scale: 1.03
 * - AC5: Every interactive element has a visible hover/focus state
 * - A9: Touch targets minimum 44×44px
 *
 * Architecture:
 * - All timing values derive from shared motion tokens
 * - CSS transitions handle visual states (hover, focus, active)
 * - JS handles hover-intent delay and interaction mode detection
 * - GSAP integration points are prepared but not active
 */

import { DURATION, EASING, MOTION_LIMITS } from '@/shared/tokens/motion';

// ── Interaction Configuration ─────────────────────────────

/**
 * Complete hero interaction configuration.
 *
 * Organized by interaction type:
 * 1. Hover Intent — delayed hover activation
 * 2. Focus Ring — keyboard focus indicator
 * 3. Pressed State — active/tap feedback
 * 4. CSS Transitions — visual state transitions
 * 5. Cursor — cursor style management
 * 6. GSAP Integration — future animation hooks
 */
export const HERO_INTERACTION = {
  /**
   * Hover Intent Configuration
   *
   * Prevents hover flickering when cursor passes over elements.
   * The hover state activates only after the cursor remains
   * stationary for the specified delay.
   *
   * From DESIGN_SYSTEM §14 Law 3:
   * "Most visitors should not consciously notice the motion."
   */
  hoverIntent: {
    /** Delay before hover activates (ms).
     *  150ms — fast enough to feel responsive, slow enough to prevent flicker. */
    delay: 150,
    /** Movement threshold (px) — cursor must stay within this radius
     *  for the delay to complete without resetting. */
    movementThreshold: 5,
  },

  /**
   * Focus Ring Configuration
   *
   * From VISUAL_RULES AC12:
   * "Interactive elements have visible focus indicators."
   *
   * From VISUAL_RULES A5:
   * "Every interactive element has a visible hover/focus state."
   *
   * Focus ring is visible ONLY for keyboard navigation (focus-visible).
   * Mouse users never see the focus ring — it would be visual noise.
   */
  focusRing: {
    /** Focus ring width (px) */
    width: 2,
    /** Focus ring offset from element edge (px) */
    offset: 2,
    /** Focus ring color — uses accent for warmth */
    color: 'var(--color-accent)',
    /** Focus ring style */
    style: 'solid' as const,
    /** Focus ring border radius — matches element */
    borderRadius: 'var(--radius-small)',
  },

  /**
   * Pressed/Active State Configuration
   *
   * From DESIGN_SYSTEM §14 Motion Constraints:
   * "Maximum hover scale: 1.03"
   * "Active press scale: 0.97"
   *
   * The pressed state provides immediate tactile feedback.
   * Subtle inward scale communicates "I received your touch."
   */
  pressed: {
    /** Scale factor on press — subtle inward compression */
    scale: MOTION_LIMITS.activePressScale,
    /** Duration of press animation (ms) */
    duration: MOTION_LIMITS.activePressDuration,
    /** Easing for press animation */
    easing: EASING.out,
  },

  /**
   * CSS Transition Definitions
   *
   * From DESIGN_SYSTEM §14 Law 2:
   * "Entry motions use ease-out. Exit motions use ease-in.
   *  State changes use ease-in-out."
   *
   * These transitions are applied via CSS, not GSAP.
   * They handle the micro-interactions that make the hero
   * feel premium even without cinematic animations.
   */
  transition: {
    /** Hover state transition — background color, text color */
    hover: `all ${DURATION.fast}ms ${EASING.inOut}`,
    /** Focus state transition — focus ring appearance */
    focus: `all ${DURATION.fast}ms ${EASING.inOut}`,
    /** Active/press state transition — scale */
    active: `all ${MOTION_LIMITS.activePressDuration}ms ${EASING.out}`,
    /** Scroll indicator fade */
    indicator: 'opacity 0.6s ease-out',
  },

  /**
   * Cursor Configuration
   *
   * From VISUAL_RULES A5:
   * "Every interactive element has a visible hover/focus state."
   *
   * Cursor changes communicate interactivity.
   */
  cursor: {
    /** Primary CTA cursor */
    primary: 'pointer' as const,
    /** Secondary CTA cursor */
    secondary: 'pointer' as const,
    /** Scroll indicator cursor */
    scrollIndicator: 'pointer' as const,
  },

  /**
   * GSAP Integration Configuration
   *
   * From DESIGN_SYSTEM §14 Law 1:
   * "Scroll-linked, not time-linked. The visitor controls the speed."
   *
   * These values are PREPARED for Phase 9 (Motion Polish).
   * No GSAP timelines are created in Phase 4.4.
   * The refs and context are established for future use.
   */
  gsap: {
    /** Context ID for GSAP cleanup */
    contextId: 'hero-interaction',
    /** Hover animation duration (s) — for future GSAP hover effects */
    hoverDuration: 0.2,
    /** Hover animation ease — gentle deceleration */
    hoverEase: 'power1.out',
    /** Press animation duration (s) */
    pressDuration: 0.1,
  },
} as const;
