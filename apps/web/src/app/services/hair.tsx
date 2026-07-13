import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/services/hair')({
  component: HairPage,
});

function HairPage() {
  return null;
}
