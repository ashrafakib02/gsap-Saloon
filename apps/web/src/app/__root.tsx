import { createRootRoute, Outlet } from '@tanstack/react-router';

function RootComponent() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-[var(--color-surface)] focus:text-[var(--color-accent)]"
      >
        Skip to content
      </a>
      <Outlet />
    </>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
