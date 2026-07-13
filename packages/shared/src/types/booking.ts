import type { ServiceSummary } from './service';
import type { ArtisanSummary } from './artisan';

export interface BookingRequest {
  serviceId: string;
  artisanId: string;
  date: string; // ISO 8601 date
  timeSlot: string; // HH:MM format
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes?: string;
}

export interface BookingResponse {
  id: string;
  status: BookingStatus;
  service: ServiceSummary;
  artisan: ArtisanSummary;
  date: string;
  timeSlot: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes?: string;
  createdAt: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';
