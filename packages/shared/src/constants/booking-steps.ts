export const BOOKING_STEPS = [
  { id: 1, name: 'Service', description: 'Choose your experience' },
  { id: 2, name: 'Artisan', description: 'Select your artisan' },
  { id: 3, name: 'Date', description: 'Pick a date' },
  { id: 4, name: 'Time', description: 'Choose a time' },
  { id: 5, name: 'Contact', description: 'Your details' },
  { id: 6, name: 'Confirm', description: 'Review & confirm' },
] as const;

export type BookingStepId = (typeof BOOKING_STEPS)[number]['id'];
