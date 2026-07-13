import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  mobileMenuOpen: boolean;
  scrollSection: string;
  isReducedMotion: boolean;
}

const initialState: UiState = {
  mobileMenuOpen: false,
  scrollSection: 'hero',
  isReducedMotion: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMobileMenu(state) {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    closeMobileMenu(state) {
      state.mobileMenuOpen = false;
    },
    setScrollSection(state, action: PayloadAction<string>) {
      state.scrollSection = action.payload;
    },
    setReducedMotion(state, action: PayloadAction<boolean>) {
      state.isReducedMotion = action.payload;
    },
  },
});

export const {
  toggleMobileMenu,
  closeMobileMenu,
  setScrollSection,
  setReducedMotion,
} = uiSlice.actions;

export const uiReducer = uiSlice.reducer;
