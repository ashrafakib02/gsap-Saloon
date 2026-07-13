import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/services/spa')({
  component: SpaPage,
});

function SpaPage() {
  return null;
}
