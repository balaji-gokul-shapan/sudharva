
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  userInfo: null,
  loading: false,
  success: false,
  error: null,
};
const options = {
  method: 'POST',
  url: '/api/auth/runner/credentials',
  headers: {
    'Content-Type': 'application/json'
  },
  data: {
    email: '',
    username: '',
    password: '',
  }
}

const getRegisterErrorMessage = (error) => {
  const status = error?.response?.status;
  const data = error?.response?.data;

  const fieldErrorCandidates = [
    Array.isArray(data?.username) ? data.username[0] : "",
    Array.isArray(data?.email) ? data.email[0] : "",
    Array.isArray(data?.non_field_errors) ? data.non_field_errors[0] : "",
    typeof data?.username === "string" ? data.username : "",
    typeof data?.email === "string" ? data.email : "",
  ].filter(Boolean);

  const candidates = [
    data?.message,
    data?.error,
    ...fieldErrorCandidates,
    typeof data === "string" ? data : "",
    error?.message,
  ].filter(Boolean);

  const combined = candidates.join(" ").toLowerCase();
  const usernameConflict =
    status === 409 ||
    ((combined.includes("username") || combined.includes("email")) &&
      (combined.includes("exist") ||
        combined.includes("taken") ||
        combined.includes("duplicate") ||
        combined.includes("already")));

  if (usernameConflict) {
    return "Username already exists. Please choose another username.";
  }

  for (const value of candidates) {
    if (typeof value !== "string") {
      continue;
    }

    const trimmed = value.trim();
    if (!trimmed) {
      continue;
    }

    const looksLikeHtml = /<[^>]+>/.test(trimmed);
    if (looksLikeHtml) {
      continue;
    }

    return trimmed;
  }

  return "Something went wrong. Please try again.";
};

const getRegisterErrorMessageFromPayload = (payload) => {
  if (!payload) {
    return "Something went wrong. Please try again.";
  }

  const candidates = [
    payload?.message,
    payload?.error,
    payload?.detail,
    typeof payload === "string" ? payload : "",
  ].filter(Boolean);

  const combined = candidates.join(" ").toLowerCase();
  const usernameConflict =
    (combined.includes("username") || combined.includes("email")) &&
    (combined.includes("exist") ||
      combined.includes("taken") ||
      combined.includes("duplicate") ||
      combined.includes("already"));

  if (usernameConflict) {
    return "Username already exists. Please choose another username.";
  }

  for (const value of candidates) {
    if (typeof value !== "string") {
      continue;
    }

    const trimmed = value.trim();
    if (!trimmed || /<[^>]+>/.test(trimmed)) {
      continue;
    }

    return trimmed;
  }

  return "Something went wrong. Please try again.";
};

const hasRegisterFailureInPayload = (payload) => {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  if (payload.success === false || payload.status === false || payload.ok === false) {
    return true;
  }

  const normalizedError =
    typeof payload.error === "string" ? payload.error.trim() : "";
  const normalizedMessage =
    typeof payload.message === "string" ? payload.message.trim() : "";

  return Boolean(normalizedError && normalizedError.toLowerCase() !== "null") ||
    /^error\b/i.test(normalizedMessage);
};

export const registerUser = createAsyncThunk(
  "userRegister/registerUser",
  async ({ username, email, password } = {}, { rejectWithValue }) => {
    const normalizedUsername = String(username || email || "").trim();
    const normalizedEmail = String(email || username || "").trim();

    if (!normalizedUsername || !normalizedEmail || !password) {
      return rejectWithValue("Username, email, and password are required.");
    }

    try {
      const response = await axios.post(options.url, {
        username: normalizedUsername,
        email: normalizedEmail,
        password,
      }, {
        headers: options.headers,
      });

      if (hasRegisterFailureInPayload(response.data)) {
        return rejectWithValue(getRegisterErrorMessageFromPayload(response.data));
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(getRegisterErrorMessage(error));
    }
  }
);

export const userRegisterSlice = createSlice({
  name: "userRegister",
  initialState,
  reducers: {
    registerRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.userInfo = action.payload;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.userInfo = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload || action.error?.message || "Registration failed.";
      });
  },
});

export const { registerRequest, registerSuccess, registerFailure } = userRegisterSlice.actions;
export default userRegisterSlice.reducer;