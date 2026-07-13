/**
 * Functional divider — thin, warm-toned, minimal.
 *
 * From VISUAL_RULES N29:
 * "Never use decorative borders, rules, or dividers between sections.
 *  Separation comes from space, not lines."
 *
 * From DESIGN_SYSTEM §11 (Borders):
 * "Borders are never decorative. Functional borders only."
 *
 * This divider is ONLY for functional use cases:
 * - Separating form sections
 * - Visual break in navigation menus
 * - Between header and content
 *
 * It is NEVER used between narrative sections (those are separated by space).
 */

// ── Types ─────────────────────────────────────────────────

interface DividerProps {
  /** Spacing above and below the divider */
  spacing?: 'intimate' | 'personal' | 'social';
  /** Additional class names */
  className?: string;
}

// ── Constants ─────────────────────────────────────────────

const SPACING_MAP = {
  intimate: 'var(--spacing-intimate)',
  personal: 'var(--spacing-personal)',
  social: 'var(--spacing-social)',
} as const;

export function Divider({ spacing = 'personal', className = '' }: DividerProps) {
  return (
    <hr
      role="separator"
      aria-orientation="horizontal"
      className={`w-full border-0 border-t border-[var(--color-surface-secondary)] ${className}`}
      style={{
        marginTop: SPACING_MAP[spacing],
        marginBottom: SPACING_MAP[spacing],
      }}
    />
  );
}
