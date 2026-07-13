import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { gsap } from 'gsap';
import { useScrollDirection } from '@/shared/hooks/ui/use-scroll-direction';
import { useScrollManager } from '@/shared/hooks/ui/use-scroll-manager';
import { useMobileMenu } from '@/shared/hooks/ui/use-mobile-menu';
import { useReducedMotion } from '@/shared/hooks/ui/use-reduced-motion';
import { setScrollSection } from '@/features/shared/store/ui-slice';
import { MobileMenu } from './mobile-menu';
import { NavLink } from './nav-link';
import { NAV_ITEMS, BOOKING_SECTION_ID } from './navigation.types';
import type { NavigationProps } from './navigation.types';

// ── Navigation Configuration ───────────────────────────────

/**
 * Section IDs for active section tracking.
 * Per PROJECT_BLUEPRINT: "Section navigation is scroll-based, not route-based"
 * Hash links: #services, #artisans, #contact, #booking
 */
const TRACKED_SECTIONS = ['hero', 'services', 'artisans', 'testimonials', 'booking', 'contact'] as const;

/**
 * Scroll direction delay before hiding header.
 * Gives user a moment to realize they're scrolling.
 */
const SCROLL_HIDE_DELAY = 300;

/**
 * Minimum scroll distance before header responds.
 * Prevents header flicker on small scroll adjustments.
 */
const SCROLL_THRESHOLD = 10;

// ── Navigation ─────────────────────────────────────────────

/**
 * Global site header — sticky, scroll-aware, responsive.
 *
 * From PROJECT_BLUEPRINT §Navigation Components:
 * "Navigation — Sticky navigation bar — scroll-aware
 *  (appears/disappears on scroll direction),
 *  holds brand mark + booking CTA"
 *
 * From TECHNICAL_ARCHITECTURE §8.4:
 * "useScrollDirection — Detect scroll up/down → Sticky navigation"
 *
 * From TECHNICAL_ARCHITECTURE §16.4:
 * "Skip-to-content link (first focusable element)" — handled in root layout
 *
 * Architecture:
 * - Sticky positioned at top
 * - Scroll-aware: hides on scroll down, shows on scroll up
 * - GSAP-animated transitions (no Framer Motion)
 * - Desktop: logo + nav links + CTA
 * - Mobile: logo + hamburger toggle
 * - Mobile menu: full-screen overlay with focus trap
 *
 * From VISUAL_RULES A5:
 * "Every interactive element has a visible hover/focus state"
 *
 * From VISUAL_RULES N29:
 * "Never use decorative borders, rules, or dividers between sections"
 * — No border-bottom on the header. Separation via spacing and background.
 *
 * From DESIGN_SYSTEM §5 (Spacing):
 * "The gap between two elements must be proportionally larger
 *  than the internal spacing of those elements"
 */
export function Navigation({ sectionIds = [...TRACKED_SECTIONS] }: NavigationProps): JSX.Element {
  const dispatch = useDispatch();
  const isReducedMotion = useReducedMotion();
  const scrollDirection = useScrollDirection({
    threshold: SCROLL_THRESHOLD,
    delay: SCROLL_HIDE_DELAY,
  });
  const { scrollToSection } = useScrollManager({
    sectionIds: [...sectionIds],
    onActiveSectionChange: (sectionId: string) => {
      dispatch(setScrollSection(sectionId));
    },
  });
  const { isOpen: isMenuOpen, toggle: toggleMenu, close: closeMenu } = useMobileMenu();

  // Current active section from Redux (set by useScrollManager)
  // We read it via the callback above and use it for NavLink active states
  const activeSection = useScrollManagerActiveSection();

  // ── Scroll-aware header animation ────────────────────────
  useEffect(() => {
    if (isReducedMotion) return;

    const header = document.querySelector('[data-nav-header]');
    if (!header) return;

    if (scrollDirection === 'down') {
      gsap.to(header, {
        y: '-100%',
        duration: 0.3,
        ease: 'power2.in',
      });
    } else {
      gsap.to(header, {
        y: '0%',
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [scrollDirection, isReducedMotion]);

  // ── Navigation handler ───────────────────────────────────
  const handleNavigate = useCallback((sectionId: string): void => {
    closeMenu();
    // Allow close animation to start before scrolling
    requestAnimationFrame(() => {
      scrollToSection(sectionId);
    });
  }, [closeMenu, scrollToSection]);

  return (
    <>
      {/*
        Site header — sticky, scroll-aware.

        From VISUAL_RULES N29: No decorative borders.
        Background uses warm surface color for visual separation.
        z-40: below mobile menu (z-50) but above content.
      */}
      <header
        data-nav-header
        role="banner"
        className={`
          fixed top-0 left-0 right-0 z-40
          bg-[var(--color-surface)]/95 backdrop-blur-sm
          will-change-transform
        `}
      >
        <div className="mx-auto max-w-[min(90vw,1200px)] flex items-center justify-between h-[72px] px-[var(--spacing-personal)]">
          {/* Logo / Brand Mark */}
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}
            className="
              font-[var(--font-serif)] text-[length:var(--text-subheading)]
              leading-[var(--leading-subheading)] tracking-[var(--tracking-subheading)]
              font-[var(--weight-subheading)]
              text-[var(--color-text)]
              min-h-[44px] min-w-[44px] inline-flex items-center
              transition-colors duration-200
              hover:text-[var(--color-accent)]
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]
            "
            aria-label="Home — scroll to top"
          >
            Salon
          </a>

          {/* Desktop navigation — hidden on mobile */}
          <nav
            aria-label="Main navigation"
            className="hidden lg:flex items-center gap-[var(--spacing-intimate)]"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.sectionId}
                item={item}
                isActive={activeSection === item.sectionId}
                onClick={handleNavigate}
              />
            ))}

            {/* Booking CTA — Primary variant per VISUAL_RULES B7 */}
            <a
              href={`#${BOOKING_SECTION_ID}`}
              onClick={(e) => { e.preventDefault(); handleNavigate(BOOKING_SECTION_ID); }}
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
            </a>
          </nav>

          {/* Mobile hamburger toggle — visible below lg breakpoint */}
          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="
              lg:hidden
              inline-flex items-center justify-center
              min-h-[44px] min-w-[44px]
              text-[var(--color-text)]
              transition-colors duration-200
              hover:text-[var(--color-accent)]
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]
            "
          >
            {/* Hamburger / Close icon — toggles based on menu state */}
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
              {isMenuOpen ? (
                // Close icon
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                // Hamburger icon
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile menu overlay — portal-like, rendered outside header */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={closeMenu}
        onNavigate={handleNavigate}
      />
    </>
  );
}

// ── Active Section Helper ──────────────────────────────────

/**
 * Reads the active section from Redux state.
 * Separated for clarity — the Navigation component dispatches
 * section changes via useScrollManager callback, and reads
 * the current section for NavLink active state.
 */
import { useSelector } from 'react-redux';
import type { RootState } from '@/lib/redux-store';

function useScrollManagerActiveSection(): string {
  return useSelector((state: RootState) => state.ui.scrollSection);
}
