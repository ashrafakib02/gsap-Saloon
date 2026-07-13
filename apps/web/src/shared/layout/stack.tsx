import type { ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────

interface StackProps {
  children: ReactNode;
  /** Stack direction */
  direction?: 'vertical' | 'horizontal';
  /** Gap between items — uses design system spacing tokens */
  gap?: 'intimate' | 'personal' | 'social' | 'formal' | 'public';
  /** Horizontal alignment (for horizontal stacks) */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Vertical alignment (for horizontal stacks) */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  /** Wrap items when they overflow */
  wrap?: boolean;
  /** Additional class names */
  className?: string;
  /** Render as specific element */
  as?: 'div' | 'ul' | 'ol' | 'nav' | 'header' | 'footer';
}

// ── Constants ─────────────────────────────────────────────

const GAP_MAP = {
  intimate: 'var(--spacing-intimate)',
  personal: 'var(--spacing-personal)',
  social: 'var(--spacing-social)',
  formal: 'var(--spacing-formal)',
  public: 'var(--spacing-public)',
} as const;

const ALIGN_MAP = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
} as const;

const JUSTIFY_MAP = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
} as const;

/**
 * Universal stacking primitive for vertical and horizontal layouts.
 *
 * Uses CSS flexbox with design system spacing tokens.
 * The gap prop enforces consistent spacing between items,
 * preventing the "something feels off" anti-pattern (VISUAL_RULES S4).
 *
 * From DESIGN_SYSTEM §5 (Spacing):
 * "The gap between two elements must be proportionally larger
 *  than the internal spacing of those elements."
 */
export function Stack({
  children,
  direction = 'vertical',
  gap = 'personal',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  className = '',
  as: Tag = 'div',
}: StackProps) {
  return (
    <Tag
      className={`flex ${className}`}
      style={{
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        gap: GAP_MAP[gap],
        alignItems: direction === 'horizontal' ? ALIGN_MAP[align] : 'stretch',
        justifyContent: direction === 'horizontal' ? JUSTIFY_MAP[justify] : 'stretch',
        flexWrap: wrap ? 'wrap' : 'nowrap',
      }}
    >
      {children}
    </Tag>
  );
}
