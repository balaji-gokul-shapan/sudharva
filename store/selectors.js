export const selectAppState = (state) => state.app;
export const selectIsAppInitialized = (state) => state.app.isInitialized;
export const selectIsAppLoading = (state) => state.app.isLoading;
export const selectAppLocale = (state) => state.app.locale;
export const selectAppErrors = (state) => state.app.errors;
