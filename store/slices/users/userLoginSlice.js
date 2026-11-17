
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";
import {
  extractAuthTokens,
  refreshUserToken,
  setAuthTokens,
} from "./userRefreshTokenSlice";


const initialState = {
  userInfo: null,
  registrationInfo: null,
  loading: false,
  success: false,
  error: null,
};
const options = {
  method: 'POST',
  url: '/api/auth/runner/token',
  headers: {
    'Content-Type': 'application/json'
  },
  data: {
    user_credentials: '',
    password: ''
  }
}
const stripHtml = (html) => {
  if (typeof window === "undefined") {
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }

  const doc = new DOMParser().parseFromString(html, "text/html");

  // Remove scripts, styles, and other non-readable elements
  doc.querySelectorAll("script, style, noscript, svg").forEach((el) =>
    el.remove()
  );

  return (doc.body.textContent || "")
    .replace(/\s+/g, " ")
    .trim();
};
const toReadableErrorMessage = (payload) => {
  if (!payload) return "Login failed";

  if (typeof payload === "string") {
    try {
      return toReadableErrorMessage(JSON.parse(payload));
    } catch {
      const readable = stripHtml(payload);
      return readable || "Login failed";
    }
  }

  if (Array.isArray(payload)) {
    return toReadableErrorMessage(payload[0]);
  }

  if (typeof payload === "object") {
    if (Array.isArray(payload.non_field_errors) && payload.non_field_errors[0]) {
      return toReadableErrorMessage(payload.non_field_errors[0]);
    }

    if (payload.detail) {
      return toReadableErrorMessage(payload.detail);
    }

    if (payload.message) {
      return toReadableErrorMessage(payload.message);
    }

    const firstKey = Object.keys(payload)[0];

    if (!firstKey) return "Login failed";

    const firstValue = payload[firstKey];

    if (Array.isArray(firstValue) && firstValue[0]) {
      return `${firstKey}: ${toReadableErrorMessage(firstValue[0])}`;
    }

    if (typeof firstValue === "string" && firstValue.trim()) {
      return `${firstKey}: ${toReadableErrorMessage(firstValue)}`;
    }
  }

  return "Login failed";
};

export const loginUser = createAsyncThunk(
  "userLogin/loginUser",
  async ({ user_credentials, password }, thunkAPI) => {
    try {
      const normalizedUsername = String(user_credentials || "").trim();
      const response = await axios({
        ...options,
        data: {
          user_credentials: normalizedUsername,
          password,
        },
      });
      const data = response.data;
      if (response.status < 200 || response.status >= 300) {
        throw new Error(data.message || "Login failed");
      }

      const tokens = extractAuthTokens(data);
      if (tokens.accessToken || tokens.refreshToken) {
        thunkAPI.dispatch(
          setAuthTokens({
            accessToken: tokens.accessToken || null,
            refreshToken: tokens.refreshToken || null,
          }),
        );

        if (!tokens.accessToken && tokens.refreshToken) {
          await thunkAPI.dispatch(
            refreshUserToken({ refresh: tokens.refreshToken }),
          ).unwrap();
        }
      } else {
        return thunkAPI.rejectWithValue(
          "Login succeeded, but no auth token was returned. Please login again.",
        );
      }

      return data;
    } catch (error) {
      const responseData = error?.response?.data;
      const message = toReadableErrorMessage(responseData) || error?.message || "Login failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const userLoginSlice = createSlice({
  name: "userLogin",
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.userInfo = action.payload;
      state.registrationInfo = action.payload?.registrations?.[0] || null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.userInfo = null;
      state.registrationInfo = null;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.userInfo = action.payload;
        state.registrationInfo = action.payload?.registrations?.[0] || null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.registrationInfo = null;
        state.error = action.payload || action.error?.message || "Login failed";
      });
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout } = userLoginSlice.actions;
export const selectLoginUserInfo = (state) => state.loginUser.userInfo;
export const selectRunnerRegistrationInfo = (state) => state.loginUser.registrationInfo;
export default userLoginSlice.reducer;