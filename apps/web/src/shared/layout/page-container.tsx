import type { ReactNode } from 'react';
import { SafeArea } from './safe-area';

// ── Types ─────────────────────────────────────────────────

interface PageContainerProps {
  children: ReactNode;
  /** Render as a specific HTML element */
  as?: 'div' | 'article' | 'section';
  /** Additional class names */
  className?: string;
}

/**
 * Full page container with proper semantic structure and safe area insets.
 *
 * Wraps all page content with:
 * - Safe area insets (for notch devices, PWA)
 * - Minimum height of 100vh
 * - Consistent horizontal breathing room at every viewport
 *
 * From VISUAL_RULES S5:
 * "Content never touches the viewport edge. Minimum horizontal margins exist
 *  at every viewport width. The content area is always surrounded by breathing room."
 *
 * From DESIGN_SYSTEM §7 (Breakpoints):
 * "Mobile-first: base styles = mobile. md: = tablet. lg: = desktop. xl: = wide."
 */
export function PageContainer({
  children,
  as: Tag = 'div',
  className = '',
}: PageContainerProps) {
  return (
    <SafeArea>
      <Tag className={`relative min-h-screen ${className}`}>{children}</Tag>
    </SafeArea>
  );
}
