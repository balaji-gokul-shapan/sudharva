import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { refreshUserToken } from "../users/userRefreshTokenSlice";

const ACCESS_TOKEN_KEY = "auth.accessToken";
const ACCESS_TOKEN_COOKIE = "auth_access_token";

const normalizeAccessToken = (value = "") => {
  const raw = String(value || "").trim();
  if (!raw) return "";

  const withoutBearer = raw.replace(/^Bearer\s+/i, "").trim();
  const withoutQuotes = withoutBearer.replace(/^['\"]|['\"]$/g, "").trim();

  let decoded = withoutQuotes;
  try {
    decoded = decodeURIComponent(withoutQuotes);
  } catch {
    decoded = withoutQuotes;
  }

  const token = String(decoded || "").trim();
  if (!token) return "";
  if (token.includes(" ")) return "";
  if (["undefined", "null", "[object Object]"].includes(token)) return "";

  return token;
};

const readStoredAccessToken = () => {
  if (typeof window === "undefined") return "";

  const stored = window.localStorage.getItem(ACCESS_TOKEN_KEY) || "";

  try {
    const parsed = JSON.parse(stored);
    if (typeof parsed === "string") return normalizeAccessToken(parsed);
  } catch {
    // Ignore non-JSON values.
  }

  return normalizeAccessToken(stored);
};

const readCookieAccessToken = () => {
  if (typeof document === "undefined") return "";

  const tokenPair = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ACCESS_TOKEN_COOKIE}=`));

  if (!tokenPair) return "";

  const raw = tokenPair.slice(ACCESS_TOKEN_COOKIE.length + 1);
  return normalizeAccessToken(raw);
};

const isHtmlString = (value) => {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  // HTML documents start with <!DOCTYPE or <html
  return /^<(!DOCTYPE|html|head|body|br\s*\/?|img\s*\/?)/i.test(trimmed);
};

const flattenValidationErrors = (payload, prefix = "") => {
  if (!payload) return [];

  if (typeof payload === "string") {
    // Server returned raw HTML (e.g. a 500/404 page). Do not surface
    // raw markup as an error — show a generic message instead.
    if (isHtmlString(payload)) return [];
    const value = payload.trim();
    if (!value) return [];
    return prefix ? [`${prefix?.replaceAll("_", " ")} - ${value}`] : [value];
  }

  if (Array.isArray(payload)) {
    return payload.flatMap((item) => flattenValidationErrors(item, prefix));
  }

  if (typeof payload !== "object") {
    const value = String(payload).trim();
    if (!value) return [];
    return prefix ? [` ${prefix?.replaceAll("_", " ")} -  ${value}`] : [value];
  }

  const messages = [];
  for (const [key, value] of Object.entries(payload)) {
    if (["message", "detail", "error"].includes(key)) {
      continue;
    }
    messages.push(...flattenValidationErrors(value, key));
  }

  return messages;
};

const dedupeMessages = (messages = []) => {
  const seen = new Set();
  return messages.filter((message) => {
    const normalized = String(message || "").trim();
    if (!normalized) return false;
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
};

const getCreateRegistrationErrorMessage = (error) => {
  const responseData = error?.response?.data;
  const status = error?.response?.status;

  // Detect raw HTML (server error page like 404/500)
  const htmlError =
    isHtmlString(responseData) ||
    (status === 404 &&
      typeof responseData === "string" &&
      /<!DOCTYPE|<html|<body/i.test(responseData));

  if (htmlError) {
    if (status === 404) {
      return "Page not found. The registration service may be unavailable. Please refresh and try again.";
    }
    return "Something went wrong. Please refresh the page and try saving your registration again.";
  }

  const fieldMessages = dedupeMessages(flattenValidationErrors(responseData));
  if (fieldMessages.length > 0) {
    return fieldMessages.map((message, index) => `${index + 1}. ${message}`).join("\n");
  }

  if (status === 401) {
    return "Your session has expired. Please log in again and try saving your registration.";
  }

  if (status === 404) {
    return "The registration service is not available right now. Please try again later.";
  }

  return (
    responseData?.message ||
    responseData?.detail ||
    responseData?.error ||
    error?.message ||
    "Something went wrong. Please try again."
  );
};

const extractRegistration = (payload) => {
  if (!payload || typeof payload !== "object") return null;
  return payload.data || payload.result || payload.registration || payload;
};

const initialState = {
  loading: false,
  error: null,
  success: false,
  data: null,
  response: null,
  requestPayload: null,
};

export const createRegistration = createAsyncThunk(
  "createRegistration",
  async (registrationData, thunkAPI) => {
    const { getState, dispatch } = thunkAPI;

    const stateAccessToken = normalizeAccessToken(
      getState()?.userRefreshToken?.accessToken || "",
    );
    const accessToken =
      stateAccessToken || readStoredAccessToken() || readCookieAccessToken();

    const resolveRequestToken = (token) => {
      if (token) return token;
      // Fall back to the axios default Authorization header (set by applyAuthHeaders
      // on login/refresh/hydrate) so a transient localStorage read never sends a
      // request without credentials.
      const defaultAuth = axios.defaults.headers.common?.Authorization;
      if (defaultAuth && typeof defaultAuth === "string") {
        return defaultAuth.replace(/^Bearer\s+/i, "").trim();
      }
      return "";
    };

    const createRequest = async (token) => {
      const resolvedToken = resolveRequestToken(token);
      return axios.post("/api/registrations/create", registrationData, {
        headers: {
          "Content-Type": "application/json",
          ...(resolvedToken
            ? { Authorization: `Bearer ${resolvedToken}` }
            : {}),
        },
      });
    };

    // DEBUG: log token source for troubleshooting auth issues
    // if (process.env.NODE_ENV === "development") {
    //   console.log("[createRegistration] accessToken from Redux:", !!accessToken);
    //   console.log("[createRegistration] token length:", accessToken?.length || 0);
    //   console.log("[createRegistration] readStoredAccessToken():", readStoredAccessToken());
    //   console.log("[createRegistration] readCookieAccessToken():", readCookieAccessToken().slice(0, 20) + "...");
    // }

    try {
      const response = await createRequest(accessToken);
      return response.data;
    } catch (error) {
      const status = error?.response?.status;
      const authMessage = String(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "",
      ).toLowerCase();
      const isAuthFailure =
        status === 401 ||
        authMessage.includes("authentication") ||
        authMessage.includes("credentials");

      if (isAuthFailure) {
        try {
          const refreshResult = await dispatch(refreshUserToken()).unwrap();
          const refreshedAccessToken =
            normalizeAccessToken(refreshResult?.accessToken || "") ||
            normalizeAccessToken(getState()?.userRefreshToken?.accessToken || "") ||
            readStoredAccessToken() ||
            readCookieAccessToken();

          if (refreshedAccessToken) {
            const retryResponse = await createRequest(refreshedAccessToken);
            return retryResponse.data;
          }
        } catch {
          // Fall through to return a session-expired message.
        }
        return thunkAPI.rejectWithValue(
          "Session expired. Please log in again and try saving your registration."
        );
      }

      return thunkAPI.rejectWithValue(getCreateRegistrationErrorMessage(error));
    }
  },
);

const createRegistrationSlice = createSlice({
  name: "createRegistration",
  initialState,
  reducers: {
    resetCreateRegistrationState: () => initialState,
    setCreateRegistrationSnapshot: (state, action) => {
      const requestPayload = action.payload?.requestPayload ?? null;
      const response = action.payload?.response ?? null;
      const dataCandidate = action.payload?.data ?? response;

      state.requestPayload = requestPayload;
      state.response = response;
      state.data = extractRegistration(dataCandidate);
      state.success = Boolean(state.data || state.response);
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRegistration.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.requestPayload = action.meta?.arg ?? null;
      })
      .addCase(createRegistration.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = extractRegistration(action.payload);
        state.response = action.payload;
        state.requestPayload = action.meta?.arg ?? state.requestPayload;
      })
      .addCase(createRegistration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Registration failed";
        state.response = null;
        state.success = false;
      });
  },
});

export const { setCreateRegistrationSnapshot, resetCreateRegistrationState } =
  createRegistrationSlice.actions;

export const selectCreateRegistrationState = (state) => state.createRegistration;
export const selectCreateRegistrationData = (state) => state.createRegistration?.data;
export const selectCreateRegistrationRequestPayload =
  (state) => state.createRegistration?.requestPayload;

export default createRegistrationSlice.reducer;
