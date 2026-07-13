import type { ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────

interface ScrollOffsetProps {
  children: ReactNode;
  /**
   * Offset in pixels above the target section.
   * Compensates for sticky navigation that overlaps content
   * when using smooth scroll / Lenis scrollTo.
   *
   * Typical values:
   * - 0: no offset (for direct navigation)
   * - 80: standard sticky nav height
   * - 100: sticky nav + breathing room
   */
  offset?: number;
  /** Additional class names */
  className?: string;
}

/**
 * Provides scroll offset compensation for sticky navigation.
 *
 * When a visitor clicks a navigation link that scrolls to a section,
 * a sticky/fixed header overlaps the section heading. This component
 * adds negative margin to compensate.
 *
 * From DESIGN_SYSTEM §5 (Spacing):
 * "Above a headline, spacing is equal to or greater than below it."
 * The scroll offset ensures the headline appears with proper breathing
 * room even when a sticky nav is present.
 *
 * Also useful with Lenis scrollTo for hash-based deep linking.
 */
export function ScrollOffset({ children, offset = 80, className = '' }: ScrollOffsetProps) {
  return (
    <div
      className={className}
      style={{
        scrollMarginTop: `${offset}px`,
      }}
    >
      {children}
    </div>
  );
}
