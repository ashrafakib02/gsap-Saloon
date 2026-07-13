import { createContext, useContext } from 'react';

// ── Cursor State ──────────────────────────────────────────

export type CursorVariant = 'default' | 'pointer' | 'text' | 'grab' | 'hidden';

export interface CursorState {
  /** Current cursor variant — components set this to change cursor appearance */
  variant: CursorVariant;
  /** Whether the custom cursor is enabled (desktop only) */
  enabled: boolean;
}

export interface CursorContextValue extends CursorState {
  /** Set the cursor variant from any descendant component */
  setVariant: (variant: CursorVariant) => void;
  /** Enable or disable the custom cursor */
  setEnabled: (enabled: boolean) => void;
}

// ── Context ───────────────────────────────────────────────

export const CursorContext = createContext<CursorContextValue | null>(null);

/**
 * Access cursor state and setters from any descendant component.
 * Must be used within a CursorProvider.
 */
export function useCursor(): CursorContextValue {
  const ctx = useContext(CursorContext);
  if (!ctx) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return ctx;
}
