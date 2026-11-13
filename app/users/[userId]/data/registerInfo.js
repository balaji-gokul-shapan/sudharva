"use client";

import { createContext, useContext, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { selectRunnerRegistrationInfo } from "@/store/slices/users/userLoginSlice";

const RunnerRegistrationContext = createContext(null);

export function useRunnerRegistration(userId) {
  const queryClient = useQueryClient();
  const registrationFromStore = useAppSelector(selectRunnerRegistrationInfo);

  useEffect(() => {
    queryClient.setQueryData(
      ["runnerRegistration", String(userId || "")],
      registrationFromStore || null,
    );
  }, [queryClient, registrationFromStore, userId]);

  const { data: registration } = useQuery({
    queryKey: ["runnerRegistration", String(userId || "")],
    queryFn: async () => registrationFromStore || null,
    initialData: registrationFromStore || null,
    staleTime: 1000 * 60 * 5,
  });

  return registration;
}

export function RunnerRegistrationProvider({ userId, children }) {
  const registration = useRunnerRegistration(userId);

  return (
    <RunnerRegistrationContext.Provider value={registration}>
      {children}
    </RunnerRegistrationContext.Provider>
  );
}

export function useRunnerRegistrationData() {
  return useContext(RunnerRegistrationContext);
}