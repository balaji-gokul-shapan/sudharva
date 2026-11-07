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
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import rootReducer from "./rootReducer";

const isDevelopment = process.env.NODE_ENV !== "production";

const createNoopStorage = () => ({
  getItem: () => Promise.resolve(null),
  setItem: (_key, value) => Promise.resolve(value),
  removeItem: () => Promise.resolve(),
});

const storage =
  typeof window === "undefined"
    ? createNoopStorage()
    : createWebStorage("local");

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["registrationDraft", "createRegistration", "loginUser"],
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
