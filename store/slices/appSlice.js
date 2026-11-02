import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isInitialized: false,
  isLoading: false,
  locale: "en",
  errors: [],
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    markAppInitialized(state) {
      state.isInitialized = true;
    },
    setAppLoading(state, action) {
      state.isLoading = action.payload;
    },
    setLocale(state, action) {
      state.locale = action.payload;
    },
    pushAppError(state, action) {
      state.errors.push({
        message: action.payload?.message,
        code: action.payload?.code,
        timestamp: Date.now(),
      });
    },
    clearAppErrors(state) {
      state.errors = [];
    },
  },
});

export const {
  markAppInitialized,
  setAppLoading,
  setLocale,
  pushAppError,
  clearAppErrors,
} = appSlice.actions;

export default appSlice.reducer;
