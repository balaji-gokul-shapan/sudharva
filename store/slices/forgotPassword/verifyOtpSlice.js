import { extractApiErrorMessage } from "@/store/utils/apiError";
import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  success: false,
  data: null,
};

const DEFAULT_ERROR_MESSAGE = "OTP verification failed";

const getVerifyUrl = () => "/api/forgot_password/otp/verify";

const getErrorMessage = (error) =>
  extractApiErrorMessage(error, { fallback: DEFAULT_ERROR_MESSAGE });

const normalizeVerifyPayload = (payload = {}) => {
  const otp = String(payload?.otp ?? "")
    .replace(/\D/g, "")
    .slice(0, 6);
  const userCredentials = String(
    payload?.user_credentials ?? payload?.userCredentials ?? payload?.identifier ?? "",
  ).trim();

  return {
    otp,
    user_credentials: userCredentials,
  };
};

export const verifyOtp = createAsyncThunk(
  "forgotPassword/verifyOtp",
  async (payload, thunkAPI) => {
    const { rejectWithValue, signal } = thunkAPI;
    const { otp, user_credentials } = normalizeVerifyPayload(payload);
    if (!/^\d{6}$/.test(otp)) {
      return rejectWithValue("Enter a valid 6-digit OTP");
    }
    if (!user_credentials) {
      return rejectWithValue("User credentials are required");
    }

    try {
      const response = await axios.post(
        getVerifyUrl(),
        {
          otp,
          user_credentials,
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
      const isLoading = getState()?.otpVerify?.loading;
      return !isLoading;
    },
  },
);

const verifyOtpSlice = createSlice({
  name: "otpVerify",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default verifyOtpSlice.reducer;
