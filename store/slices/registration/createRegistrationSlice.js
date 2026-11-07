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

const getCreateRegistrationErrorMessage = (error) => {
  const responseData = error?.response?.data;

  return (
    responseData?.message ||
    responseData?.detail ||
    responseData?.error ||
    error?.message ||
    "Registration failed"
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

    const createRequest = async (token) => {
      return axios.post("/api/registrations/create", registrationData, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    };

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
          // Fall through to return the original auth error.
        }
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
