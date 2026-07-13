import { configureStore } from '@reduxjs/toolkit';
import { bookingReducer } from '@/features/booking/store/booking-slice';
import { uiReducer } from '@/features/shared/store/ui-slice';

export const store = configureStore({
  reducer: {
    booking: bookingReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
