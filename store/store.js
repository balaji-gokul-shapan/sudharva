import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./rootReducer";

const isDevelopment = process.env.NODE_ENV !== "production";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["registrationDraft", "createRegistration", "master"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = (preloadedState) => {
  return configureStore({
    reducer: persistedReducer,
    preloadedState,
    devTools: isDevelopment,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: isDevelopment,
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
};

export const store = makeStore();
export const persistor = persistStore(store);
