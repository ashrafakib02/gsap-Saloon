import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────

interface PortalProps {
  children: ReactNode;
  /** ID of the container element to portal into */
  containerId: string;
}

// ── Component ─────────────────────────────────────────────

/**
 * Renders children into a DOM container outside the component tree.
 *
 * Used for modals, toasts, and overlays that need to escape
 * parent stacking contexts. The target container must exist in the DOM
 * (rendered by __root.tsx).
 *
 * Handles the case where the container doesn't exist yet (during SSR
 * or initial render) by deferring portal creation.
 */
export function Portal({ children, containerId }: PortalProps) {
  const [container, setContainer] = useState<Element | null>(null);

  useEffect(() => {
    const el = document.getElementById(containerId);
    setContainer(el);
  }, [containerId]);

  if (!container) return null;

  return createPortal(children, container);
}
