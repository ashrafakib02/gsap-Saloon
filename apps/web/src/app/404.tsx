import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/404')({
  component: NotFoundPage,
});

function NotFoundPage() {
  return null;
}
