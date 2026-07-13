import type { ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────

interface SafeAreaProps {
  children: ReactNode;
  /** Apply top safe area insets (for notch devices) */
  top?: boolean;
  /** Apply bottom safe area insets (for home indicator) */
  bottom?: boolean;
  /** Apply left/right safe area insets */
  horizontal?: boolean;
  /** Additional class names */
  className?: string;
}

/**
 * Safe area insets for modern devices with notches, rounded corners,
 * and home indicators.
 *
 * Uses CSS env() values from the viewport-fit=cover meta tag.
 * Falls back gracefully on devices without safe area requirements.
 *
 * From VISUAL_RULES S5:
 * "Content never touches the viewport edge."
 *
 * Safe areas extend this rule to physical device constraints:
 * content never touches the safe area boundary either.
 */
export function SafeArea({
  children,
  top = true,
  bottom = true,
  horizontal = false,
  className = '',
}: SafeAreaProps) {
  return (
    <div
      className={className}
      style={{
        paddingTop: top ? 'env(safe-area-inset-top, 0px)' : undefined,
        paddingBottom: bottom ? 'env(safe-area-inset-bottom, 0px)' : undefined,
        paddingLeft: horizontal ? 'env(safe-area-inset-left, 0px)' : undefined,
        paddingRight: horizontal ? 'env(safe-area-inset-right, 0px)' : undefined,
      }}
    >
      {children}
    </div>
  );
}
