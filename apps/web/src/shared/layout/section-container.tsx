import type { ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────

interface SectionContainerProps {
  children: ReactNode;
  /** Render as a specific HTML element */
  as?: 'section' | 'div' | 'article';
  /** Vertical spacing tier between this section and adjacent sections */
  spacing?: 'personal' | 'social' | 'formal' | 'public';
  /** Accessible label for the section (used with as="section") */
  ariaLabel?: string;
  /** ID for scroll-to-section deep linking */
  id?: string;
  /** Additional class names */
  className?: string;
}

/**
 * Section-level container that provides consistent vertical spacing
 * between sections of the narrative experience.
 *
 * From DESIGN_SYSTEM §5 (Spacing):
 * "Section spacing (between sections) uses the Formal or Public tier."
 *
 * From VISUAL_RULES S3:
 * "Sections are clearly separated — the visitor feels the transition."
 *
 * The spacing prop maps directly to design system spacing tokens:
 * - personal: 1rem (within-component boundaries)
 * - social: 1.5rem (between related blocks)
 * - formal: 3rem (between sections — default)
 * - public: 5rem (between major regions)
 */
const SPACING_MAP = {
  personal: 'var(--spacing-personal)',
  social: 'var(--spacing-social)',
  formal: 'var(--spacing-formal)',
  public: 'var(--spacing-public)',
} as const;

export function SectionContainer({
  children,
  as: Tag = 'section',
  spacing = 'formal',
  ariaLabel,
  id,
  className = '',
}: SectionContainerProps) {
  return (
    <Tag
      id={id}
      aria-label={ariaLabel}
      className={`relative ${className}`}
      style={{ paddingTop: SPACING_MAP[spacing], paddingBottom: SPACING_MAP[spacing] }}
    >
      {children}
    </Tag>
  );
}
