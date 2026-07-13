import { createContext, useContext } from 'react';

// ── Types ─────────────────────────────────────────────────

export interface PortalContextValue {
  modalRoot: HTMLElement | null;
  toastRoot: HTMLElement | null;
}

// ── Context ───────────────────────────────────────────────

export const PortalContext = createContext<PortalContextValue>({
  modalRoot: null,
  toastRoot: null,
});

/**
 * Access portal root elements from any descendant component.
 * Used by the Portal component and Modal/Toast components.
 */
export function usePortalRoots(): PortalContextValue {
  return useContext(PortalContext);
}
