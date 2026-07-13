import type { ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────

interface VisuallyHiddenProps {
  children: ReactNode;
  /** Render as a specific element */
  as?: 'span' | 'div' | 'p';
}

/**
 * Hides content visually while keeping it accessible to screen readers.
 *
 * From DESIGN_SYSTEM §16 (Accessibility):
 * "Screen reader landmarks, alt text, ARIA patterns are non-negotiable."
 *
 * From VISUAL_RULES A11:
 * "Meaningful images have descriptive alt text."
 *
 * Use cases:
 * - Labels for icon-only buttons
 * - Section headings for screen readers when visual heading is decorative
 * - Additional context for assistive technologies
 *
 * WCAG 2.1 compliant clip-rect approach — zero layout impact.
 */
export function VisuallyHidden({ children, as: Tag = 'span' }: VisuallyHiddenProps) {
  return (
    <Tag
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        borderWidth: 0,
      }}
    >
      {children}
    </Tag>
  );
}
