// "use client";
// import { useEffect, useMemo } from "react";
// import { useAppSelector } from "@/store/hooks";
// import { useQuery } from "@tanstack/react-query";
// import { useQueryClient } from "@tanstack/react-query";
// import { selectRunnerRegistrationInfo } from "@/store/slices/users/userLoginSlice";
// import { getUserData } from "./userData";

// export const useUserDetails = (userId) => {
//   const queryClient = useQueryClient();
//   const registrationFromStore = useAppSelector(selectRunnerRegistrationInfo);
//   const queryKey = useMemo(
//     () => ["userDetails", String(userId || "")],
//     [userId],
//   );

//   useEffect(() => {
//     if (userId && registrationFromStore) {
//       queryClient.setQueryData(queryKey, registrationFromStore);
//     }
//   }, [registrationFromStore, queryClient, queryKey, userId]);

//   const query = useQuery({
//     queryKey,
//     queryFn: () => queryClient.getQueryData(queryKey) ?? null,
//     enabled: Boolean(userId),
//   });

//   return {
//     ...query,
//     registration: query.data ?? registrationFromStore ?? null,
//   };
// };

// export const userDetails = useUserDetails;

// export { getUserData };