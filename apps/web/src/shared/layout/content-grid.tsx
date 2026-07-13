import type { ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────

interface ContentGridProps {
  children: ReactNode;
  /**
   * Grid variant — maps to design system column behavior.
   * - 'auto': CSS Grid with auto-fit columns (responsive without breakpoints)
   * - 'two': 2-column layout at tablet+, single on mobile
   * - 'three': 3-column layout at desktop+, 2 at tablet, 1 on mobile
   * - 'asymmetric': 2/3 + 1/3 split at desktop (editorial layout)
   */
  variant?: 'auto' | 'two' | 'three' | 'asymmetric';
  /** Gap between grid items — uses spacing tokens */
  gap?: 'intimate' | 'personal' | 'social' | 'formal';
  /** Vertical alignment */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Additional class names */
  className?: string;
}

// ── Constants ─────────────────────────────────────────────

const GAP_MAP = {
  intimate: 'var(--spacing-intimate)',
  personal: 'var(--spacing-personal)',
  social: 'var(--spacing-social)',
  formal: 'var(--spacing-formal)',
} as const;

const VARIANT_CLASSES: Record<NonNullable<ContentGridProps['variant']>, string> = {
  auto: 'grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))]',
  two: 'grid-cols-1 md:grid-cols-2',
  three: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  asymmetric: 'grid-cols-1 lg:grid-cols-[2fr_1fr]',
};

const ALIGN_MAP = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
} as const;

/**
 * Responsive content grid based on the design system's column system.
 *
 * From DESIGN_SYSTEM §6 (Grid):
 * "Desktop: Asymmetric compositions (two-thirds/one-third splits)"
 * "Tablet: Adapted column system, proportional"
 * "Mobile: Single column with consistent horizontal margins"
 *
 * From VISUAL_RULES S4:
 * "No two elements of the same structural type have different spacing."
 * Grid gap enforces consistent spacing across all grid items.
 *
 * Mobile-first: all variants default to single column,
 * expanding at tablet (md) and desktop (lg) breakpoints.
 */
export function ContentGrid({
  children,
  variant = 'auto',
  gap = 'personal',
  align = 'start',
  className = '',
}: ContentGridProps) {
  return (
    <div
      className={`grid ${VARIANT_CLASSES[variant]} ${ALIGN_MAP[align]} ${className}`}
      style={{
        gap: GAP_MAP[gap],
      }}
    >
      {children}
    </div>
  );
}
