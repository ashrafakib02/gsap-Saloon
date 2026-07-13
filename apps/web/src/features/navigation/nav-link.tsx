import type { NavLinkProps } from './navigation.types';

// ── NavLink ────────────────────────────────────────────────

/**
 * Individual navigation link with active state detection.
 *
 * From PROJECT_BLUEPRINT §Navigation Components:
 * "NavigationLink — Navigation items with anchor scroll behavior"
 *
 * From VISUAL_RULES T14:
 * "ALL-CAPS reserved for very short labels (navigation items) at most, sparingly"
 *
 * From VISUAL_RULES A5:
 * "Every interactive element has a visible hover/focus state"
 *
 * From VISUAL_RULES A6:
 * "Focus indicators are always visible — gold accent, 2px minimum"
 *
 * From VISUAL_RULES B4:
 * "Accent gold may appear as thin 1px border on nav underlines,
 *  active state indicators"
 *
 * From DESIGN_SYSTEM §7 (Breakpoints):
 * "Mobile (< 768px): Near-full viewport width with margins"
 *
 * Touch target: 44×44px minimum (VISUAL_RULES AC12)
 */
export function NavLink({ item, isActive, onClick, className = '' }: NavLinkProps): JSX.Element {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    onClick(item.sectionId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-current={isActive ? ('page' as const) : undefined}
      className={`
        group relative inline-flex items-center justify-center
        min-h-[44px] min-w-[44px] px-[var(--spacing-personal)]
        font-[var(--font-sans)] text-[length:var(--text-body)] font-[var(--weight-body)]
        tracking-[var(--tracking-body)] leading-[var(--leading-body)]
        text-[var(--color-text-secondary)]
        transition-colors duration-200 ease-in-out
        hover:text-[var(--color-text)]
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]
        uppercase
        ${className}
      `}
    >
      {item.label}

      {/* Active indicator — thin gold underline per VISUAL_RULES B4 */}
      <span
        aria-hidden="true"
        className={`
          absolute bottom-2 left-1/2 -translate-x-1/2
          h-[1px] bg-[var(--color-accent)]
          transition-all duration-200 ease-in-out
          ${isActive
            ? 'w-[calc(100%-2*var(--spacing-personal))] opacity-100'
            : 'w-0 opacity-0 group-hover:w-[calc(100%-2*var(--spacing-personal))] group-hover:opacity-60'
          }
        `}
      />
    </button>
  );
}
