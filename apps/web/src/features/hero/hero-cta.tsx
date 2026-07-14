/**
 * HeroCTA — Interactive Call-to-Action Component
 *
 * From DESIGN_SYSTEM §14 Law 2:
 * "Entry motions use ease-out. Exit motions use ease-in.
 *  State changes use ease-in-out."
 *
 * From VISUAL_RULES:
 * - B2: "CTAs are sentence case, no exclamation marks"
 * - B10: "No exclamation marks on buttons. Ever."
 * - AC12: "Interactive elements have visible focus indicators"
 * - A9: "Touch targets are minimum 44×44px"
 *
 * Architecture:
 * - Uses useHoverIntent for hover detection (no inline handlers)
 * - CSS pseudo-classes handle visual state transitions
 * - GSAP integration: refs only (no animations in Phase 4.4)
 * - Focus management via hero interaction context
 * - Accessible: visible focus ring, keyboard operable
 */

import { useCallback, useEffect, useRef } from 'react';
import { useHeroInteractionContext } from './hero-interaction-context';
import { useHoverIntent } from './hooks/use-hover-intent';
import { HERO_INTERACTION } from './hero-interaction.config';

// ── Props ────────────────────────────────────────────────────

interface HeroCTAProps {
  /** The destination URL */
  href: string;
  /** The CTA label text */
  label: string;
  /** Visual variant — determines styling */
  variant: 'primary' | 'ghost';
  /** Whether the CTA should be visible */
  isVisible: boolean;
  /** Additional CSS class names */
  className?: string;
}

// ── Component ────────────────────────────────────────────────

/**
 * Interactive CTA button with hover intent and focus management.
 *
 * This component:
 * - Uses useHoverIntent for hover state (delayed activation)
 * - Uses context for interaction mode (showFocusRing, isTouch)
 * - Provides a ref for future GSAP animations
 * - Uses CSS pseudo-classes for all visual state transitions
 * - No inline event handlers on the rendered element
 *
 * From VISUAL_RULES AC5:
 * "Every interactive element has a visible hover/focus state."
 */
export function HeroCTA({
  href,
  label,
  variant,
  isVisible,
  className = '',
}: HeroCTAProps) {
  const { showFocusRing, isTouch, registerAnimationTarget } =
    useHeroInteractionContext();

  /* ── Hover Intent (ref-based, no inline handlers) ─────── */
  const { ref, isHovered, handlers } = useHoverIntent();

  /* ── GSAP Registration Ref ────────────────────────────── */
  const ctaRef = useRef<HTMLAnchorElement | null>(null);
  useEffect(() => {
    registerAnimationTarget(`cta-${variant}`, ctaRef);
  }, [variant, registerAnimationTarget]);

  /* ── Merged Ref ───────────────────────────────────────── */
  const mergedRef = useCallback(
    (node: HTMLAnchorElement | null) => {
      ctaRef.current = node;
      if (ref && typeof ref === 'object' && 'current' in ref) {
        (ref as React.MutableRefObject<HTMLAnchorElement | null>).current =
          node;
      }
    },
    [ref],
  );

  /* ── Dynamic Styles ───────────────────────────────────── */
  const style = {
    '--cta-bg': isHovered
      ? 'var(--color-accent-hover)'
      : 'var(--color-accent)',
    '--cta-scale': isHovered
      ? `${HERO_INTERACTION.pressed.scale}`
      : '1',
  } as React.CSSProperties;

  /* ── CSS Classes ──────────────────────────────────────── */
  const classes = [
    'hero-cta',
    `hero-cta--${variant}`,
    isVisible ? 'hero-cta--visible' : 'hero-cta--hidden',
    showFocusRing ? 'hero-cta--focus-visible' : '',
    isTouch ? 'hero-cta--touch' : '',
    isHovered ? 'hero-cta--hovered' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <a
      ref={mergedRef}
      href={href}
      className={classes}
      style={style}
      data-gsap-id={`cta-${variant}`}
      {...handlers}
    >
      {label}
    </a>
  );
}
