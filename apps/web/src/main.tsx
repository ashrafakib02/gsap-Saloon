import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './app/routeTree.gen';
import { RootProvider } from './app/providers/root-provider';

// Styles — order matters: tailwind first, then global, fonts, animations
import './styles/tailwind.css';
import './styles/fonts.css';
import './styles/global.css';
import './styles/animations.css';

// ── Router Configuration ──────────────────────────────────

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
});

// Register the router instance for type-safe navigation
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// ── Mount ─────────────────────────────────────────────────

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Ensure index.html contains <div id="root">.');
}

createRoot(rootElement).render(
  <StrictMode>
    <RootProvider>
      <RouterProvider router={router} />
    </RootProvider>
  </StrictMode>,
);
