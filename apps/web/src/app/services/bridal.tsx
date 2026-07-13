import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/services/bridal')({
  component: BridalPage,
});

function BridalPage() {
  return null;
}
