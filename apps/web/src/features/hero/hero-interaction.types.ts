/**
 * Hero Interaction — Type Definitions
 *
 * From DESIGN_SYSTEM §18 (State Philosophy):
 * "Every interactive element exists in multiple states.
 *  Without a defined state philosophy, each element invents
 *  its own state behavior."
 *
 * From VISUAL_RULES AC5:
 * "Every interactive element has a visible hover/focus state."
 *
 * From VISUAL_RULES A9:
 * "Touch targets are minimum 44×44px. Spacing between adjacent
 *  targets is minimum 8px."
 *
 * This file defines ALL types for the Hero interaction layer.
 * No implementation — only structural truth.
 *
 * Architecture:
 * - InteractionMode tracks HOW the user is interacting (keyboard/pointer/touch)
 * - CTA visual states are CSS-driven (hover, focus-visible, active)
 * - JS-only states are for what CSS cannot handle (hover intent delay)
 * - GSAP integration types prepare for Phase 9 (no animations created)
 */

import type { RefObject, KeyboardEvent as ReactKeyboardEvent } from 'react';

// ── Interaction Mode ──────────────────────────────────────

/**
 * The primary input method the user is currently employing.
 *
 * From DESIGN_SYSTEM §7 (Mobile-First):
 * "Mobile is not a smaller version of desktop. Mobile is a different
 *  context — a different physical relationship between the user
 *  and the screen."
 *
 * This distinction drives:
 * - Focus ring visibility (keyboard → visible, pointer → hidden)
 * - Hover state availability (pointer → yes, touch → no)
 * - Touch target sizing (touch → 48px+, pointer → 44px+)
 */
export type InteractionMode = 'keyboard' | 'pointer' | 'touch' | 'none';

// ── CTA States ────────────────────────────────────────────

/**
 * Visual state of a CTA element.
 *
 * These states are MUTUALLY EXCLUSIVE at any given moment.
 * The highest-priority active state wins.
 *
 * Priority: active > focus > hover > idle
 *
 * From DESIGN_SYSTEM §18:
 * "State transitions are animated with consistent timing."
 */
export type CTAVisualState = 'idle' | 'hover' | 'focus' | 'active';

// ── Hero CTA Props ────────────────────────────────────────

/**
 * Props for the HeroCTA component.
 *
 * From VISUAL_RULES B2: "CTAs are sentence case, no exclamation marks."
 * From VISUAL_RULES B10: "No exclamation marks on buttons. Ever."
 * From VISUAL_RULES AC12: "Interactive elements have visible focus indicators."
 */
export interface HeroCTAProps {
  /** The destination URL */
  href: string;
  /** The CTA label text */
  label: string;
  /** Visual variant — determines styling */
  variant: 'primary' | 'ghost';
  /** Whether the CTA should be visible (driven by hero ready state) */
  isVisible: boolean;
  /** Additional CSS class names */
  className?: string;
}

// ── Scroll Indicator Props ────────────────────────────────

/**
 * Props for the HeroScrollIndicator component.
 *
 * From DESIGN_SYSTEM §14 Law 3:
 * "Most visitors should not consciously notice the motion.
 *  They should notice the feeling."
 */
export interface HeroScrollIndicatorProps {
  /** ARIA label for the scroll indicator */
  label: string;
  /** Bottom position CSS value */
  bottom: string;
  /** Whether the indicator should be visible */
  isVisible: boolean;
  /** Target section ID to scroll to on click */
  targetId?: string;
}

// ── Hover Intent ──────────────────────────────────────────

/**
 * Configuration for hover intent detection.
 *
 * Hover intent prevents flickering when the cursor passes over
 * elements — the hover state activates only after the cursor
 * remains stationary for the specified delay.
 *
 * From DESIGN_SYSTEM §14 Law 3:
 * "Most visitors should not consciously notice the motion."
 *
 * The delay makes hover feel intentional, not accidental.
 */
export interface HoverIntentOptions {
  /** Delay in ms before hover activates (default: 150) */
  delay?: number;
  /** Movement threshold in px before hover resets (default: 5) */
  movementThreshold?: number;
}

/**
 * Return type for the useHoverIntent hook.
 */
export interface UseHoverIntentReturn<T extends HTMLElement = HTMLElement> {
  /** Ref to attach to the interactive element */
  ref: RefObject<T | null>;
  /** Whether the element is currently in hover state (after intent delay) */
  isHovered: boolean;
  /** Event handlers to spread onto the element (via ref) */
  handlers: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onFocus: () => void;
    onBlur: () => void;
  };
}

// ── Hero Interaction Hook ─────────────────────────────────

/**
 * Return type for the useHeroInteraction hook.
 *
 * Provides the complete interaction state for the hero section.
 * All sub-components read from this hook via context.
 */
export interface UseHeroInteractionReturn {
  /** Current interaction mode (how the user is interacting) */
  interactionMode: InteractionMode;
  /** Whether focus rings should be visible */
  showFocusRing: boolean;
  /** Whether hover states should be active */
  supportsHover: boolean;
  /** Whether the device is touch-primary */
  isTouch: boolean;
  /** Whether reduced motion is preferred */
  prefersReducedMotion: boolean;
  /** Event handlers for the hero section root element */
  rootHandlers: {
    onKeyDown: (e: ReactKeyboardEvent<HTMLElement>) => void;
    onPointerDown: () => void;
    onTouchStart: () => void;
  };
  /** GSAP context ref for future animation integration */
  gsapContextRef: RefObject<unknown | null>;
  /** Refs map for future animation targets */
  animationTargetRefs: Map<string, RefObject<HTMLElement | null>>;
  /** Register an animation target ref by key */
  registerAnimationTarget: (key: string, ref: RefObject<HTMLElement | null>) => void;
}

// ── Hero Interaction Context ──────────────────────────────

/**
 * The value provided by HeroInteractionProvider.
 *
 * From DESIGN_SYSTEM §16 (Naming):
 * "Context names describe the data they provide, not the component
 *  that provides them."
 */
export interface HeroInteractionContextValue {
  /** Current interaction mode */
  interactionMode: InteractionMode;
  /** Whether focus rings should be visible */
  showFocusRing: boolean;
  /** Whether hover states should be active */
  supportsHover: boolean;
  /** Whether the device is touch-primary */
  isTouch: boolean;
  /** Whether reduced motion is preferred */
  prefersReducedMotion: boolean;
  /** GSAP context ref for future animation integration */
  gsapContextRef: RefObject<unknown | null>;
  /** Refs map for future animation targets */
  animationTargetRefs: Map<string, RefObject<HTMLElement | null>>;
  /** Register an animation target ref by key */
  registerAnimationTarget: (key: string, ref: RefObject<HTMLElement | null>) => void;
}
