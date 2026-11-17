import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { extractApiErrorMessage } from "@/store/utils/apiError";

const initialState = {
  loading: false,
  error: null,
  success: false,
  data: null,
};

const DEFAULT_ERROR_MESSAGE = "Password reset failed";

const getResetUrl = () => "/api/forgot_password/reset";

const getErrorMessage = (error) =>
  extractApiErrorMessage(error, { fallback: DEFAULT_ERROR_MESSAGE });

const normalizeResetPayload = (payload = {}) => {
  const userCredentials = String(
    payload?.user_credentials ?? payload?.userCredentials ?? payload?.identifier ?? "",
  ).trim();
  const newPassword = String(
    payload?.new_password ?? payload?.newPassword ?? "",
  );
  const resetToken = String(
    payload?.reset_token ?? payload?.resetToken ?? payload?.token ?? "",
  ).trim();

  return {
    user_credentials: userCredentials,
    new_password: newPassword,
    reset_token: resetToken,
  };
};

export const resetPassword = createAsyncThunk(
  "forgotPassword/resetPassword",
  async (payload, thunkAPI) => {
    const { rejectWithValue, signal } = thunkAPI;
    const normalizedPayload = normalizeResetPayload(payload);

    if (!normalizedPayload.user_credentials) {
      return rejectWithValue("User credentials are required");
    }

    if (!normalizedPayload.new_password) {
      return rejectWithValue("New password is required");
    }

    if (normalizedPayload.new_password.length < 8) {
      return rejectWithValue("Password should be at least 8 characters.");
    }

    const requestBody = {
      user_credentials: normalizedPayload.user_credentials,
      new_password: normalizedPayload.new_password,
      ...(normalizedPayload.reset_token
        ? { reset_token: normalizedPayload.reset_token }
        : {}),
    };

    try {
      const response = await axios.post(getResetUrl(), requestBody, {
        signal,
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: (_, { getState }) => {
      const isLoading = getState()?.resetPassword?.loading;
      return !isLoading;
    },
  },
);

const resetPasswordSlice = createSlice({
  name: "resetPassword",
  initialState,
  reducers: {
    resetResetPasswordState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.data = action.payload ?? null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload || action.error?.message || DEFAULT_ERROR_MESSAGE;
      });
  },
});

export const { resetResetPasswordState } = resetPasswordSlice.actions;
export default resetPasswordSlice.reducer;
