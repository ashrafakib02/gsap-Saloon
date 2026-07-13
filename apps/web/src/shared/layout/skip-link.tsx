/**
 * Accessibility skip navigation link.
 *
 * From TECHNICAL_ARCHITECTURE §16.4:
 * "Skip-to-content link (first focusable element)"
 *
 * From VISUAL_RULES A6:
 * "Focus indicators are always visible."
 *
 * The skip link is the first focusable element in the DOM.
 * When focused (via Tab key), it becomes visible with the brand's
 * gold accent focus ring. It bypasses all navigation and animated
 * sections, jumping directly to <main id="main-content">.
 */

interface SkipLinkProps {
  /** Target element ID to scroll to */
  targetId?: string;
  /** Visible text */
  children?: string;
}

export function SkipLink({
  targetId = 'main-content',
  children = 'Skip to content',
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:z-[9999] focus:block focus:p-4 focus:text-[length:var(--text-body)] focus:text-[var(--color-surface)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-accent)]"
    >
      {children}
    </a>
  );
}
