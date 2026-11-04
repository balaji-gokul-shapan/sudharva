import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  error: null,
  success: false,
  data: null,
};

const DEFAULT_ERROR_MESSAGE = "OTP verification failed";

const getVerifyUrl = () => "/api/auth/otp/verify";

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  DEFAULT_ERROR_MESSAGE;

const normalizeVerifyPayload = (payload = {}) => {
  const otp = String(payload?.otp ?? "").replace(/\D/g, "").slice(0, 6);
  const email =
    payload?.email == null ? null : String(payload.email).trim();
  const mobile_number =
    payload?.mobile_number == null
      ? null
      : String(payload.mobile_number).trim();

  return {
    otp,
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

export const verifyOtp = createAsyncThunk(
  "otpVerify/verifyOtp",
  async (payload, thunkAPI) => {
    const { rejectWithValue, signal } = thunkAPI;
    const { otp, email, mobile_number } = normalizeVerifyPayload(payload);

    if (!/^\d{6}$/.test(otp)) {
      return rejectWithValue("Enter a valid 6-digit OTP");
    }

    if (!email && !mobile_number) {
      return rejectWithValue("Email or mobile number is required");
    }

    try {
      const response = await axios.post(
        getVerifyUrl(),
        {
          otp,
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
      const isLoading = getState()?.otpVerify?.loading;
      return !isLoading;
    },
  },
);

const otpVerifySlice = createSlice({
  name: "otpVerify",
  initialState,
  reducers: {
    resetOtpVerifyState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyOtp.pending, (state) => {
        setPendingState(state);
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.data = action.payload ?? null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        setFailureState(
          state,
          action.payload || action.error?.message || DEFAULT_ERROR_MESSAGE,
        );
      });
  },
});

export const { resetOtpVerifyState } = otpVerifySlice.actions;
export default otpVerifySlice.reducer;
