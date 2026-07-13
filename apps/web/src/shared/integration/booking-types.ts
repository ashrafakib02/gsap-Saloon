/**
 * Booking integration type definitions.
 * Interfaces only — no implementation. These types will be used by
 * the booking flow (Phase 5) and API layer (Phase 10).
 *
 * @module booking-types
 */

/**
 * A single available booking time slot.
 */
interface BookingSlot {
  /** Unique identifier for this slot. */
  id: string;
  /** The service this slot is for. */
  serviceId: string;
  /** Optional assigned artisan/stylist. */
  artisanId?: string;
  /** Date in ISO 8601 format (YYYY-MM-DD). */
  date: string;
  /** Time in 24h format (HH:mm). */
  time: string;
  /** Duration in minutes. */
  duration: number;
  /** Whether this slot is currently available for booking. */
  available: boolean;
}

/**
 * A request to create a new booking.
 */
interface BookingRequest {
  /** ID of the service being booked. */
  serviceId: string;
  /** Optional preferred artisan/stylist. */
  artisanId?: string;
  /** Preferred date in ISO 8601 format. */
  date: string;
  /** Preferred time in 24h format. */
  time: string;
  /** Client's full name. */
  clientName: string;
  /** Client's email address. */
  clientEmail: string;
  /** Client's phone number. */
  clientPhone: string;
  /** Optional additional notes or requests. */
  notes?: string;
}

/**
 * Confirmation details for a confirmed booking.
 */
interface BookingConfirmation {
  /** Unique booking identifier. */
  id: string;
  /** ID of the booked service. */
  serviceId: string;
  /** Confirmed date in ISO 8601 format. */
  date: string;
  /** Confirmed time in 24h format. */
  time: string;
  /** Duration in minutes. */
  duration: number;
  /** Name of the assigned artisan/stylist. */
  artisanName: string;
  /** Total cost in the smallest currency unit (e.g., cents). */
  total: number;
  /** Current booking status. */
  status: 'confirmed' | 'pending' | 'cancelled';
}

/**
 * Current state of the multi-step booking flow.
 */
interface BookingState {
  /** Current step in the booking wizard. */
  step: 'service' | 'artisan' | 'datetime' | 'details' | 'confirmation';
  /** Selected service ID. */
  serviceId?: string;
  /** Selected artisan ID. */
  artisanId?: string;
  /** Selected date. */
  date?: string;
  /** Selected time. */
  time?: string;
  /** Client information entered in the details step. */
  clientInfo?: {
    name: string;
    email: string;
    phone: string;
    notes?: string;
  };
}

/**
 * A service offered by the salon.
 */
interface ServiceOption {
  /** Unique service identifier. */
  id: string;
  /** Display name of the service. */
  name: string;
  /** Brief description of what the service includes. */
  description: string;
  /** Duration in minutes. */
  duration: number;
  /** Price in the smallest currency unit (e.g., cents). */
  price: number;
  /** Category this service belongs to (e.g., 'hair', 'nails', 'spa'). */
  category: string;
}

/**
 * A stylist/artisan available for booking.
 */
interface ArtisanOption {
  /** Unique artisan identifier. */
  id: string;
  /** Display name. */
  name: string;
  /** List of service specializations. */
  specialties: string[];
  /** Optional profile photo URL. */
  avatar?: string;
  /** Whether this artisan is currently accepting bookings. */
  available: boolean;
}

export type {
  BookingSlot,
  BookingRequest,
  BookingConfirmation,
  BookingState,
  ServiceOption,
  ArtisanOption,
};
