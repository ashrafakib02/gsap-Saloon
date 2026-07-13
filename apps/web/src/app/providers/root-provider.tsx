import type { ReactNode } from 'react';
import { CursorContext } from '@/shared/hooks/ui/use-cursor';
import { useCursorState } from '@/lib/cursor';
import { ReduxProvider } from './redux-provider';
import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';
import { AnimationProvider } from './animation-provider';
import { PortalProvider } from './portal-provider';

/**
 * Composes all global providers in the correct order.
 *
 * Provider hierarchy (outer → inner):
 *   ReduxProvider          — Global client state (booking, UI)
 *   QueryProvider          — Server state management (TanStack Query)
 *   ThemeProvider          — OS preference detection (reduced motion)
 *   AnimationProvider      — GSAP + Lenis initialization
 *   PortalProvider         — Modal + Toast portal roots
 *   CursorContext.Provider — Custom cursor state (desktop-only)
 *
 * From PROJECT_BLUEPRINT §1 (app/providers/):
 * "root-provider.tsx composes all providers"
 */
export function RootProvider({ children }: { children: ReactNode }) {
  const cursorState = useCursorState();

  return (
    <ReduxProvider>
      <QueryProvider>
        <ThemeProvider>
          <AnimationProvider>
            <PortalProvider>
              <CursorContext.Provider value={cursorState}>
                {children}
              </CursorContext.Provider>
            </PortalProvider>
          </AnimationProvider>
        </ThemeProvider>
      </QueryProvider>
    </ReduxProvider>
  );
}
