import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './app/routeTree.gen';
import { RootProvider } from './app/providers/root-provider';
import './styles/tailwind.css';
import './styles/global.css';

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root')!;

createRoot(rootElement).render(
  <StrictMode>
    <RootProvider>
      <RouterProvider router={router} />
    </RootProvider>
  </StrictMode>,
);
