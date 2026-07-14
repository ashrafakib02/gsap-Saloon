/**
 * HeroScrollIndicator — Scroll Down Indicator Component
 *
 * From DESIGN_SYSTEM §14 Law 3:
 * "Most visitors should not consciously notice the motion.
 *  They should notice the feeling."
 *
 * Architecture:
 * - Click handler scrolls to target section (via context or prop)
 * - Hover state via useHoverIntent hook
 * - CSS-driven animation for the scroll hint
 * - Accessible: aria-label, keyboard operable
 * - Touch-aware: larger touch targets on touch devices
 *
 * From VISUAL_RULES:
 * - A9: "Touch targets are minimum 44×44px"
 * - AC12: "Interactive elements have visible focus indicators"
 */

import { useCallback, useRef, useEffect } from 'react';
import { useHeroInteractionContext } from './hero-interaction-context';
import { useHoverIntent } from './hooks/use-hover-intent';

// ── Props ────────────────────────────────────────────────────

interface HeroScrollIndicatorProps {
  /** ARIA label for the scroll indicator */
  label: string;
  /** Bottom position CSS value */
  bottom: string;
  /** Whether the indicator should be visible */
  isVisible: boolean;
  /** Target section ID to scroll to on click */
  targetId?: string;
}

// ── Component ────────────────────────────────────────────────

/**
 * Scroll indicator with hover state and click-to-scroll.
 *
 * This component:
 * - Scrolls to the target section on click
 * - Uses useHoverIntent for hover state
 * - Uses context for touch detection (larger touch targets)
 * - CSS-driven animation for the scroll hint
 * - No inline event handlers
 *
 * From EXPERIENCE_STORYBOARD SCENE 2:
 * "The scroll indicator is an invitation, not a command."
 */
export function HeroScrollIndicator({
  label,
  bottom,
  isVisible,
  targetId,
}: HeroScrollIndicatorProps) {
  const { isTouch, registerAnimationTarget } =
    useHeroInteractionContext();

  /* ── Hover Intent ──────────────────────────────────────── */
  const { ref, isHovered, handlers } = useHoverIntent({
    delay: 100, // Slightly faster for small indicator
  });

  /* ── GSAP Registration Ref ────────────────────────────── */
  const indicatorRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    registerAnimationTarget('scroll-indicator', indicatorRef);
  }, [registerAnimationTarget]);

  /* ── Merged Ref ───────────────────────────────────────── */
  const mergedRef = useCallback(
    (node: HTMLElement | null) => {
      indicatorRef.current = node;
      if (ref && typeof ref === 'object' && 'current' in ref) {
        (ref as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    },
    [ref],
  );

  /* ── Scroll Handler ───────────────────────────────────── */
  const handleClick = useCallback(() => {
    if (!targetId) return;
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [targetId]);

  /* ── Keyboard Handler ─────────────────────────────────── */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick],
  );

  /* ── CSS Classes ──────────────────────────────────────── */
  const classes = [
    'scroll-indicator',
    isVisible ? 'scroll-indicator--visible' : 'scroll-indicator--hidden',
    isTouch ? 'scroll-indicator--touch' : '',
    isHovered ? 'scroll-indicator--hovered' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={mergedRef}
      type="button"
      className={classes}
      style={{ bottom }}
      aria-label={label}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      data-gsap-id="scroll-indicator"
      {...handlers}
    >
      <span className="scroll-indicator__chevron" aria-hidden="true">
        ↓
      </span>
    </button>
  );
}
