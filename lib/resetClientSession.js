import { persistor } from "@/store/store";
import { logout } from "@/store/slices/users/userLoginSlice";
import { clearAuthSession } from "@/store/slices/users/userRefreshTokenSlice";
import { clearRegistrationDraft } from "@/store/slices/registration/registrationDraftSlice";
import { resetCreateRegistrationState } from "@/store/slices/registration/createRegistrationSlice";

const clearAllCookies = () => {
  if (typeof document === "undefined") return;

  const cookies = document.cookie ? document.cookie.split(";") : [];
  cookies.forEach((cookieEntry) => {
    const cookieName = cookieEntry.split("=")[0]?.trim();
    if (!cookieName) return;

    document.cookie = `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  });
};

export const resetClientSessionData = async (dispatch) => {
  if (typeof window === "undefined" || !dispatch) return;

  dispatch({ type: "app/resetState" });
  dispatch(logout());
  dispatch(clearAuthSession());
  dispatch(clearRegistrationDraft());
  dispatch(resetCreateRegistrationState());

  try {
    persistor.pause();
    await persistor.flush();
    await persistor.purge();
    persistor.persist();
  } catch {
    // Continue clearing browser storage even if persist engine errors.
  }

  try {
    window.localStorage.clear();
  } catch {
    // Ignore browser storage errors.
  }

  try {
    window.sessionStorage.clear();
  } catch {
    // Ignore browser storage errors.
  }

  clearAllCookies();
};
