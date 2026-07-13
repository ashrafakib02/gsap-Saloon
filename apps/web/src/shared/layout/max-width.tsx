import type { ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────

interface MaxWidthProps {
  children: ReactNode;
  /**
   * Maximum width preset.
   * - 'narrow': 65ch — body copy max line length (T7: 65-75 chars)
   * - 'content': 60-65% viewport — editorial content width
   * - 'wide': 90% viewport — for wider compositions
   * - 'full': 100% — full-bleed (hero images, atmospheric photography)
   */
  variant?: 'narrow' | 'content' | 'wide' | 'full';
  /** Center the container horizontally */
  centered?: boolean;
  /** Additional class names */
  className?: string;
  /** Render as specific element */
  as?: 'div' | 'article' | 'section' | 'main';
}

// ── Constants ─────────────────────────────────────────────

/**
 * Width presets mapped to design system requirements.
 *
 * From DESIGN_SYSTEM §6 (Grid):
 * "Desktop (1440px+): Content Width 60-65% of viewport"
 * "Tablet (768-1439px): Proportional to reading experience"
 * "Mobile (< 768px): Near-full viewport width with margins"
 *
 * From VISUAL_RULES T7:
 * "Body copy maximum line length is 65-75 characters"
 */
const WIDTH_MAP = {
  /** 65ch — body copy max line length per T7 */
  narrow: '65ch',
  /** ~60-65% viewport — editorial content width per DESIGN_SYSTEM §6 */
  content: 'min(65vw, 900px)',
  /** ~90% viewport — wider compositions, still with margins */
  wide: 'min(90vw, 1200px)',
  /** 100% — full-bleed elements */
  full: '100%',
} as const;

const PADDING_MAP = {
  narrow: 'var(--spacing-personal)',
  content: 'var(--spacing-personal)',
  wide: 'var(--spacing-intimate)',
  full: '0',
} as const;

export function MaxWidth({
  children,
  variant = 'content',
  centered = true,
  className = '',
  as: Tag = 'div',
}: MaxWidthProps) {
  return (
    <Tag
      className={`${centered ? 'mx-auto' : ''} ${className}`}
      style={{
        maxWidth: WIDTH_MAP[variant],
        paddingLeft: PADDING_MAP[variant],
        paddingRight: PADDING_MAP[variant],
      }}
    >
      {children}
    </Tag>
  );
}
