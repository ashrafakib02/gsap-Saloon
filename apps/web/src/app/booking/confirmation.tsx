import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/booking/confirmation')({
  component: BookingConfirmationPage,
});

function BookingConfirmationPage() {
  return null;
}
