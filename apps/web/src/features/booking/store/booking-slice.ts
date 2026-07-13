import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface BookingState {
  isOpen: boolean;
  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  selections: {
    serviceId: string | null;
    artisanId: string | null;
    date: string | null;
    timeSlot: string | null;
  };
  contact: {
    name: string;
    email: string;
    phone: string;
    notes: string;
  };
  isSubmitting: boolean;
  error: string | null;
}

const initialState: BookingState = {
  isOpen: false,
  currentStep: 1,
  selections: {
    serviceId: null,
    artisanId: null,
    date: null,
    timeSlot: null,
  },
  contact: {
    name: '',
    email: '',
    phone: '',
    notes: '',
  },
  isSubmitting: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    openBooking(state) {
      state.isOpen = true;
    },
    closeBooking(state) {
      state.isOpen = false;
      state.currentStep = 1;
      state.error = null;
    },
    setStep(state, action: PayloadAction<1 | 2 | 3 | 4 | 5 | 6>) {
      state.currentStep = action.payload;
    },
    nextStep(state) {
      if (state.currentStep < 6) {
        state.currentStep = (state.currentStep + 1) as 1 | 2 | 3 | 4 | 5 | 6;
      }
    },
    prevStep(state) {
      if (state.currentStep > 1) {
        state.currentStep = (state.currentStep - 1) as 1 | 2 | 3 | 4 | 5 | 6;
      }
    },
    setService(state, action: PayloadAction<string>) {
      state.selections.serviceId = action.payload;
    },
    setArtisan(state, action: PayloadAction<string>) {
      state.selections.artisanId = action.payload;
    },
    setDate(state, action: PayloadAction<string>) {
      state.selections.date = action.payload;
    },
    setTimeSlot(state, action: PayloadAction<string>) {
      state.selections.timeSlot = action.payload;
    },
    setContact(state, action: PayloadAction<Partial<BookingState['contact']>>) {
      state.contact = { ...state.contact, ...action.payload };
    },
    setSubmitting(state, action: PayloadAction<boolean>) {
      state.isSubmitting = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    resetBooking() {
      return initialState;
    },
  },
});

export const {
  openBooking,
  closeBooking,
  setStep,
  nextStep,
  prevStep,
  setService,
  setArtisan,
  setDate,
  setTimeSlot,
  setContact,
  setSubmitting,
  setError,
  resetBooking,
} = bookingSlice.actions;

export const bookingReducer = bookingSlice.reducer;
