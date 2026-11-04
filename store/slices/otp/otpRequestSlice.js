import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  error: null,
  success: false,
  data: null,
};

const DEFAULT_ERROR_MESSAGE = "OTP request failed";

const getRequestOtpUrl = () => {
  // Same-origin call to avoid browser CORS; handled server-side in Next route.
  // const baseUrl = process.env.API_BASE_URL || "";
  // if (!baseUrl) {
  //   throw new Error("API_BASE_URL is not configured on the server.");
  // }
  return "/api/auth/otp/request";
};

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  DEFAULT_ERROR_MESSAGE;

const normalizeRequestPayload = (payload = {}) => {
  const purpose = String(payload?.purpose ?? "email").trim() || "email";
  const email = String(payload?.email ?? "").trim();
  const mobile_number = String(payload?.mobile_number ?? "").trim();

  return {
    // purpose,
    email,
    mobile_number,
  };
};

const setPendingState = (state) => {
  state.loading = true;
  state.error = null;
  state.success = false;
  state.data = null;
};

const setFailureState = (state, error) => {
  state.loading = false;
  state.error = error;
  state.success = false;
  state.data = null;
};

export const requestOtp = createAsyncThunk(
  "otpRequest/requestOtp",
  async (payload, thunkAPI) => {
    const { rejectWithValue, signal } = thunkAPI;
    const { purpose, email, mobile_number } = normalizeRequestPayload(payload);

    if (!email && !mobile_number) {
      return rejectWithValue("Email or mobile number is required");
    }

    try {
      const response = await axios.post(
        getRequestOtpUrl(),
        {
          purpose,
          email,
          mobile_number,
        },
        {
          signal,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: (_, { getState }) => {
      const isLoading = getState()?.otpRequest?.loading;
      return !isLoading;
    },
  },
);

const otpRequestSlice = createSlice({
  name: "otpRequest",
  initialState,
  reducers: {
    resetRequestOtpState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestOtp.pending, (state) => {
        setPendingState(state);
      })
      .addCase(requestOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.data = action.payload ?? null;
      })
      .addCase(requestOtp.rejected, (state, action) => {
        setFailureState(state, action.payload || action.error?.message || DEFAULT_ERROR_MESSAGE);
      });
  },
});

export const { resetRequestOtpState } = otpRequestSlice.actions;
export const { resetRequestOtpState: resetRequestOtpUrl } = otpRequestSlice.actions;
export default otpRequestSlice.reducer;
