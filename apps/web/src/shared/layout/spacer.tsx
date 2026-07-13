// ── Types ─────────────────────────────────────────────────

interface SpacerProps {
  /**
   * Vertical size — maps to the 5-tier spacing scale.
   * 'auto' uses flex grow to fill available space.
   */
  size?: 'intimate' | 'personal' | 'social' | 'formal' | 'public' | 'auto';
  /** Render as a specific element */
  as?: 'div' | 'span';
  /** Additional class names */
  className?: string;
}

// ── Constants ─────────────────────────────────────────────

const SIZE_MAP = {
  intimate: 'var(--spacing-intimate)',
  personal: 'var(--spacing-personal)',
  social: 'var(--spacing-social)',
  formal: 'var(--spacing-formal)',
  public: 'var(--spacing-public)',
  auto: '0',
} as const;

/**
 * Design-token-based spacing utility.
 *
 * Inserts vertical or horizontal space between elements
 * using the exact values from the 5-tier spacing scale.
 *
 * From DESIGN_SYSTEM §5:
 * "Five tiers provide sufficient variation without creating inconsistency."
 *
 * Use Spacer sparingly — prefer natural spacing from Stack/SectionContainer.
 * Spacer is for cases where explicit, token-based spacing is needed
 * between elements that don't have a direct parent container controlling gap.
 */
export function Spacer({ size = 'personal', as: Tag = 'div', className = '' }: SpacerProps) {
  return (
    <Tag
      className={className}
      style={{
        width: '100%',
        height: SIZE_MAP[size],
        flexShrink: 0,
        flexGrow: size === 'auto' ? 1 : 0,
      }}
      aria-hidden="true"
    />
  );
}
