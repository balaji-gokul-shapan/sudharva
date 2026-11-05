
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";
import {
  applyAuthHeaders,
  extractAuthTokens,
  persistAuthTokens,
} from "./userRefreshTokenSlice";


const initialState = {
  userInfo: null,
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
    username: '',
    password: ''
  }
}

const toReadableErrorMessage = (payload) => {
  if (!payload) return "Login failed";
  if (typeof payload === "string") {
    try {
      return toReadableErrorMessage(JSON.parse(payload));
    } catch {
      return payload;
    }
  }

  if (Array.isArray(payload)) {
    return payload[0] || "Login failed";
  }

  if (typeof payload === "object") {
    if (Array.isArray(payload.non_field_errors) && payload.non_field_errors[0]) {
      return payload.non_field_errors[0];
    }
    if (payload.detail) return String(payload.detail);
    if (payload.message) return String(payload.message);

    const firstKey = Object.keys(payload)[0];
    if (!firstKey) return "Login failed";

    const firstValue = payload[firstKey];
    if (Array.isArray(firstValue) && firstValue[0]) {
      return `${firstKey}: ${firstValue[0]}`;
    }

    if (typeof firstValue === "string" && firstValue.trim()) {
      return `${firstKey}: ${firstValue}`;
    }
  }

  return "Login failed";
};

export const loginUser = createAsyncThunk(
  "userLogin/loginUser",
  async ({ username, password }, thunkAPI) => {
    try {
      const normalizedUsername = String(username || "").trim();
      const response = await axios({
        ...options,
        data: {
          username: normalizedUsername,
          password,
        },
      });
      const data = response.data;
      if (response.status < 200 || response.status >= 300) {
        throw new Error(data.message || "Login failed");
      }

      const tokens = extractAuthTokens(data);
      if (tokens.accessToken) {
        persistAuthTokens(tokens);
        applyAuthHeaders(tokens.accessToken);
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
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.userInfo = null;
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
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || action.error?.message || "Login failed";
      });
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout } = userLoginSlice.actions;
export default userLoginSlice.reducer;