export interface TimeSlot {
  time: string; // HH:MM format
  isAvailable: boolean;
  artisanId: string;
  date: string;
}

export interface AvailabilityQuery {
  artisanId: string;
  serviceId: string;
  date: string;
}

export interface AvailabilityResponse {
  date: string;
  artisanId: string;
  slots: TimeSlot[];
}
