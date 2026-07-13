import type { ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────

interface SectionWrapperProps {
  children: ReactNode;
  /** Background treatment for the section */
  background?: 'surface' | 'surface-secondary' | 'surface-elevated' | 'none';
  /** Vertical padding within the section */
  paddingY?: 'none' | 'intimate' | 'personal' | 'social' | 'formal' | 'public';
  /** Render as a specific HTML element */
  as?: 'section' | 'div' | 'article';
  /** ID for anchor navigation */
  id?: string;
  /** Accessible label */
  ariaLabel?: string;
  /** Additional class names */
  className?: string;
}

// ── Constants ─────────────────────────────────────────────

const BACKGROUND_MAP = {
  surface: 'var(--color-surface)',
  'surface-secondary': 'var(--color-surface-secondary)',
  'surface-elevated': 'var(--color-surface-elevated)',
  none: 'transparent',
} as const;

const PADDING_MAP = {
  none: '0',
  intimate: 'var(--spacing-intimate)',
  personal: 'var(--spacing-personal)',
  social: 'var(--spacing-social)',
  formal: 'var(--spacing-formal)',
  public: 'var(--spacing-public)',
} as const;

/**
 * Section wrapper with background and padding controls.
 *
 * Unlike SectionContainer (which provides inter-section spacing),
 * SectionWrapper provides intra-section styling: background color
 * and vertical padding.
 *
 * From DESIGN_SYSTEM §5 (Spacing):
 * "Every component has internal padding that prevents content
 *  from touching its boundaries."
 *
 * From DESIGN_SYSTEM §3 (Color):
 * "Three chromatic roles: Surface, Text, Accent."
 * Background options map to the surface role variants.
 */
export function SectionWrapper({
  children,
  background = 'none',
  paddingY = 'formal',
  as: Tag = 'section',
  id,
  ariaLabel,
  className = '',
}: SectionWrapperProps) {
  return (
    <Tag
      id={id}
      aria-label={ariaLabel}
      className={`relative w-full ${className}`}
      style={{
        backgroundColor: BACKGROUND_MAP[background],
        paddingTop: PADDING_MAP[paddingY],
        paddingBottom: PADDING_MAP[paddingY],
      }}
    >
      {children}
    </Tag>
  );
}
