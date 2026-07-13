import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { PortalContext } from './portal-context';

// ── Provider ──────────────────────────────────────────────

interface PortalProviderProps {
  children: ReactNode;
}

/**
 * Creates and manages global portal root elements for modals and toasts.
 *
 * Portal roots are rendered in __root.tsx:
 * - `<div id="modal-root" />` — for booking overlay, modals
 * - `<div id="toast-root" />` — for toast notifications
 *
 * This provider reads those DOM elements and provides them via context
 * so Portal components can render into them.
 */
export function PortalProvider({ children }: PortalProviderProps) {
  const [roots, setRoots] = useState<{ modalRoot: HTMLElement | null; toastRoot: HTMLElement | null }>({
    modalRoot: null,
    toastRoot: null,
  });

  useEffect(() => {
    setRoots({
      modalRoot: document.getElementById('modal-root'),
      toastRoot: document.getElementById('toast-root'),
    });
  }, []);

  return <PortalContext.Provider value={roots}>{children}</PortalContext.Provider>;
}
