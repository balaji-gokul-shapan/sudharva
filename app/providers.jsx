"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/store/store";
import { hydrateAuthFromStorage } from "@/store/slices/users/userRefreshTokenSlice";
import { TooltipProvider } from "@/components/ui/tooltip";

function AuthBootstrap({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hydrateAuthFromStorage());
  }, [dispatch]);

  return children;
}

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={children} persistor={persistor}>
          <TooltipProvider>
            <AuthBootstrap>{children}</AuthBootstrap>
          </TooltipProvider>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}
