import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const ACCESS_TOKEN_KEY = "auth.accessToken";
const REFRESH_TOKEN_KEY = "auth.refreshToken";
const ACCESS_TOKEN_COOKIE = "auth_access_token";
const REFRESH_TOKEN_COOKIE = "auth_refresh_token";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const initialState = {
  accessToken: null,
  refreshToken: null,
  loading: false,
  success: false,
  error: null,
};

export const extractAuthTokens = (payload = {}) => {
  const source = payload?.data ?? payload;
  const tokenContainer =
    source?.tokens ||
    source?.token_data ||
    source?.auth ||
    source?.token ||
    {};

  const accessToken =
    source?.access ||
    source?.access_token ||
    source?.accessToken ||
    tokenContainer?.access ||
    tokenContainer?.access_token ||
    tokenContainer?.accessToken ||
    (typeof source?.token === "string" ? source.token : null) ||
    (typeof tokenContainer?.token === "string" ? tokenContainer.token : null) ||
    null;

  const refreshToken =
    source?.refresh ||
    source?.refresh_token ||
    source?.refreshToken ||
    tokenContainer?.refresh ||
    tokenContainer?.refresh_token ||
    tokenContainer?.refreshToken ||
    null;

  return { accessToken, refreshToken };
};

export const persistAuthTokens = ({ accessToken, refreshToken }) => {
  if (typeof window === "undefined") return;

  if (accessToken) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    document.cookie = `${ACCESS_TOKEN_COOKIE}=${encodeURIComponent(
      accessToken,
    )}; Path=/; Max-Age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
  }

  if (refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    document.cookie = `${REFRESH_TOKEN_COOKIE}=${encodeURIComponent(
      refreshToken,
    )}; Path=/; Max-Age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
  }
};

export const applyAuthHeaders = (accessToken) => {
  if (accessToken) {
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
};

export const readStoredRefreshToken = () => {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(REFRESH_TOKEN_KEY) || "";
};

export const clearStoredAuthTokens = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  document.cookie = `${ACCESS_TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  document.cookie = `${REFRESH_TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
};

export const refreshUserToken = createAsyncThunk(
  "userRefreshToken/refreshUserToken",
  async (payload = {}, thunkAPI) => {
    const fallbackRefresh = thunkAPI.getState()?.userRefreshToken?.refreshToken;
    const refresh = payload?.refresh || readStoredRefreshToken() || fallbackRefresh;

    if (!refresh) {
      return thunkAPI.rejectWithValue("No refresh token available");
    }

    try {
      const response = await axios.post(
        "/api/auth/runner/token/refresh",
        { refresh },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = response.data;
      const tokens = extractAuthTokens(data);

      if (!tokens.accessToken) {
        throw new Error("Refresh response did not include an access token.");
      }

      persistAuthTokens({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken || refresh,
      });
      applyAuthHeaders(tokens.accessToken);

      return {
        ...data,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken || refresh,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Could not refresh session.",
      );
    }
  },
);

const userRefreshTokenSlice = createSlice({
  name: "userRefreshToken",
  initialState,
  reducers: {
    hydrateAuthFromStorage: (state) => {
      if (typeof window === "undefined") return;

      const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
      const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);

      state.accessToken = accessToken || null;
      state.refreshToken = refreshToken || null;
      state.error = null;
      state.success = Boolean(accessToken);

      applyAuthHeaders(accessToken || null);
    },
    setAuthTokens: (state, action) => {
      const { accessToken = null, refreshToken = null } = action.payload || {};

      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.error = null;
      state.success = Boolean(accessToken);

      persistAuthTokens({ accessToken, refreshToken });
      applyAuthHeaders(accessToken);
    },
    clearAuthSession: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.loading = false;
      state.success = false;
      state.error = null;

      clearStoredAuthTokens();
      applyAuthHeaders(null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshUserToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshUserToken.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.accessToken = action.payload?.accessToken || null;
        state.refreshToken = action.payload?.refreshToken || null;
      })
      .addCase(refreshUserToken.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || action.error?.message || "Session refresh failed.";
      });
  },
});

export const { hydrateAuthFromStorage, setAuthTokens, clearAuthSession } =
  userRefreshTokenSlice.actions;

export default userRefreshTokenSlice.reducer;