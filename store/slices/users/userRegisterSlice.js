
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

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Registration failed.",
      );
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