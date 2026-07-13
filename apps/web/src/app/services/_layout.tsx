import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/services/_layout')({
  component: ServicesLayout,
});

function ServicesLayout() {
  return <Outlet />;
}
