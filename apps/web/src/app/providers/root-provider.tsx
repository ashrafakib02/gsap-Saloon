import type { ReactNode } from 'react';
import { ReduxProvider } from './redux-provider';
import { QueryProvider } from './query-provider';

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <QueryProvider>
        {children}
      </QueryProvider>
    </ReduxProvider>
  );
}
