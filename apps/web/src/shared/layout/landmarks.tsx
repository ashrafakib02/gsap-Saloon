import type { ReactNode } from 'react';

/**
 * Semantic landmark components.
 *
 * From TECHNICAL_ARCHITECTURE §16.4:
 * "Proper ARIA landmarks — header, main, footer, nav"
 *
 * From DESIGN_SYSTEM §16:
 * "Screen reader landmarks are non-negotiable."
 *
 * These wrap semantic HTML5 elements with consistent styling.
 * They provide the landmark structure that assistive technologies
 * rely on for navigation.
 */

// ── Types ─────────────────────────────────────────────────

interface LandmarkProps {
  children: ReactNode;
  /** Additional class names */
  className?: string;
}

interface NavLandmarkProps extends LandmarkProps {
  /** Accessible label for the navigation landmark */
  'aria-label'?: string;
}

// ── Components ────────────────────────────────────────────

export function Header({ children, className = '' }: LandmarkProps) {
  return (
    <header className={className} role="banner">
      {children}
    </header>
  );
}

export function Main({ children, className = '' }: LandmarkProps) {
  return (
    <main id="main-content" className={className} tabIndex={-1}>
      {children}
    </main>
  );
}

export function Footer({ children, className = '' }: LandmarkProps) {
  return (
    <footer className={className} role="contentinfo">
      {children}
    </footer>
  );
}

export function Nav({ children, className = '', 'aria-label': label = 'Main navigation' }: NavLandmarkProps) {
  return (
    <nav className={className} aria-label={label}>
      {children}
    </nav>
  );
}
