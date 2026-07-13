import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { useFocusTrap } from '@/shared/hooks/ui/use-focus-trap';
import { useReducedMotion } from '@/shared/hooks/ui/use-reduced-motion';
import { NAV_ITEMS, BOOKING_SECTION_ID } from './navigation.types';
import type { MobileMenuProps } from './navigation.types';

// ── Animation Config ───────────────────────────────────────

/**
 * From VISUAL_RULES M4:
 * "Maximum animation duration for content reveals is 600ms"
 * From TECHNICAL_ARCHITECTURE §8.5:
 * "hover: 250ms, click: 100ms"
 *
 * Mobile menu uses soft easing, fast — no exaggerated movement.
 */
const MENU_ANIMATION = {
  overlayDuration: 0.3,
  contentDuration: 0.35,
  staggerDelay: 0.04,
  easeOut: 'power2.out',
  easeIn: 'power2.in',
} as const;

// ── MobileMenu ─────────────────────────────────────────────

/**
 * Full-screen mobile navigation overlay.
 *
 * From PROJECT_BLUEPRINT §Navigation Components:
 * "MobileMenu — Full-screen overlay for mobile navigation
 *  with brand typography and warm aesthetic"
 *
 * From TECHNICAL_ARCHITECTURE §16.4:
 * "Keyboard-navigable hamburger menu on mobile"
 * "Focus trap within mobile menu when open"
 * "aria-expanded on hamburger button"
 *
 * From VISUAL_RULES AC5:
 * "prefers-reduced-motion is always respected"
 *
 * Architecture:
 * - Portal-rendered to avoid z-index stacking issues
 * - GSAP-animated enter/exit (no Framer Motion per user requirement)
 * - Focus trap via useFocusTrap hook
 * - Body scroll lock managed by useMobileMenu hook
 */
export function MobileMenu({ isOpen, onClose, onNavigate }: MobileMenuProps): JSX.Element {
  const isReducedMotion = useReducedMotion();
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Focus trap — active when menu is open
  const { containerRef } = useFocusTrap({
    active: isOpen,
    initialFocus: closeRef.current,
  });

  // Handle navigation — close menu and scroll to section
  const handleNavigate = useCallback((sectionId: string): void => {
    onClose();
    // Small delay to allow close animation to start
    requestAnimationFrame(() => {
      onNavigate(sectionId);
    });
  }, [onClose, onNavigate]);

  // GSAP enter/exit animation
  useEffect(() => {
    if (!overlayRef.current || !contentRef.current) return;

    // Kill any running animation
    if (tlRef.current) {
      tlRef.current.kill();
    }

    if (isOpen) {
      // ── Enter ──────────────────────────────────────────
      const tl = gsap.timeline();

      // Set initial states
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(contentRef.current, { y: '100%' });
      gsap.set(contentRef.current.querySelectorAll('[data-menu-item]'), {
        opacity: 0,
        y: 20,
      });

      if (isReducedMotion) {
        // Instant appearance for reduced motion
        gsap.set(overlayRef.current, { opacity: 1 });
        gsap.set(contentRef.current, { y: '0%' });
        gsap.set(contentRef.current.querySelectorAll('[data-menu-item]'), {
          opacity: 1,
          y: 0,
        });
      } else {
        // Animated entrance
        tl.to(overlayRef.current, {
          opacity: 1,
          duration: MENU_ANIMATION.overlayDuration,
          ease: MENU_ANIMATION.easeOut,
        });

        tl.to(contentRef.current, {
          y: '0%',
          duration: MENU_ANIMATION.contentDuration,
          ease: MENU_ANIMATION.easeOut,
        }, '-=0.15');

        // Stagger menu items
        const items = contentRef.current.querySelectorAll('[data-menu-item]');
        tl.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.25,
          stagger: MENU_ANIMATION.staggerDelay,
          ease: MENU_ANIMATION.easeOut,
        }, '-=0.2');
      }

      tlRef.current = tl;
    } else {
      // ── Exit ───────────────────────────────────────────
      const tl = gsap.timeline();

      if (isReducedMotion) {
        // Instant disappearance
        gsap.set(overlayRef.current, { opacity: 0 });
        gsap.set(contentRef.current, { y: '100%' });
      } else {
        // Animated exit
        tl.to(contentRef.current.querySelectorAll('[data-menu-item]'), {
          opacity: 0,
          y: 10,
          duration: 0.15,
          ease: MENU_ANIMATION.easeIn,
        });

        tl.to(contentRef.current, {
          y: '100%',
          duration: MENU_ANIMATION.contentDuration,
          ease: MENU_ANIMATION.easeIn,
        }, '-=0.1');

        tl.to(overlayRef.current, {
          opacity: 0,
          duration: MENU_ANIMATION.overlayDuration,
          ease: MENU_ANIMATION.easeIn,
        }, '-=0.2');
      }

      tlRef.current = tl;
    }

    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
      }
    };
  }, [isOpen, isReducedMotion]);

  // Don't render anything if menu has never been opened
  // (avoids unnecessary DOM nodes)
  if (!isOpen) {
    return <div ref={containerRef} aria-hidden="true" className="hidden" />;
  }

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      className="fixed inset-0 z-50 lg:hidden"
    >
      {/* Overlay — warm semi-transparent background */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-[var(--color-text)]/60 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Content panel — slides up from bottom */}
      <div
        ref={contentRef}
        className="absolute inset-x-0 bottom-0 top-0 flex flex-col bg-[var(--color-surface)] overflow-y-auto"
      >
        {/* Close button — top right, 44×44px touch target */}
        <div className="flex justify-end p-[var(--spacing-personal)]" data-menu-item>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="
              inline-flex items-center justify-center
              min-h-[44px] min-w-[44px]
              text-[var(--color-text)]
              transition-colors duration-200
              hover:text-[var(--color-accent)]
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]
            "
          >
            {/* Close icon — SVG X mark */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Navigation links — large, editorial typography */}
        <nav
          aria-label="Mobile navigation"
          className="flex-1 flex flex-col items-center justify-center gap-[var(--spacing-social)]"
        >
          {NAV_ITEMS.map((item) => (
            <div key={item.sectionId} data-menu-item>
              <button
                type="button"
                onClick={() => handleNavigate(item.sectionId)}
                className="
                  font-[var(--font-serif)] text-[length:var(--text-heading)]
                  leading-[var(--leading-heading)] tracking-[var(--tracking-heading)]
                  font-[var(--weight-heading)]
                  text-[var(--color-text)]
                  min-h-[44px] min-w-[44px]
                  transition-colors duration-200
                  hover:text-[var(--color-accent)]
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]
                  uppercase
                "
              >
                {item.label}
              </button>
            </div>
          ))}

          {/* Booking CTA — Primary variant per VISUAL_RULES B7 */}
          <div className="mt-[var(--spacing-personal)]" data-menu-item>
            <button
              type="button"
              onClick={() => handleNavigate(BOOKING_SECTION_ID)}
              className="
                inline-flex items-center justify-center
                min-h-[44px] min-w-[44px] px-[var(--spacing-social)]
                bg-[var(--color-accent)] text-[var(--color-surface)]
                font-[var(--font-sans)] text-[length:var(--text-body)]
                font-[var(--weight-body)] tracking-[var(--tracking-body)]
                rounded-[var(--radius-small)]
                transition-all duration-200
                hover:bg-[var(--color-accent-hover)]
                active:scale-[0.97]
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]
              "
            >
              Book now
            </button>
          </div>
        </nav>

        {/* Bottom spacer for safe area */}
        <div className="h-[var(--spacing-formal)]" aria-hidden="true" />
      </div>
    </div>
  );
}
