import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { extractApiErrorMessage } from "../../utils/apiError";

const initialState = {
  loading: false,
  error: null,
  success: false,
  data: null,
};

const DEFAULT_ERROR_MESSAGE = "OTP request failed";

const getRequestOtpUrl = () => {
  // The Next.js route proxies this same-origin request to API_BASE_URL.
  return "/api/forgot_password/otp/request";
};

const getErrorMessage = (error) =>
  extractApiErrorMessage(error, {
    fallback: "Unable to send OTP right now. Please try again.",
  });

export const normalizeRequestPayload = (payload) => {
  const normalizedIdentifier =
    payload?.user_credentials?.trim() || payload?.identifier?.trim() || "";

  return {
    user_credentials: normalizedIdentifier,
  };
};

export const getRequestOtp = createAsyncThunk(
  "forgotPassword/getRequestOtp",
  async (payload, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const { user_credentials } = normalizeRequestPayload(payload);

    if (!user_credentials) {
      return rejectWithValue("User Credential is required");
    }

    try {
      const response = await axios.post(
        getRequestOtpUrl(),
        normalizeRequestPayload(payload),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (response.status !== 200) {
        throw new Error(DEFAULT_ERROR_MESSAGE);
      }
      return response.data;
    } catch (error) {
      const responseData = error?.response?.data;

      if (responseData) {
        return rejectWithValue(responseData);
      }

      return rejectWithValue(getErrorMessage(error) || DEFAULT_ERROR_MESSAGE);
    }
  },
  {
    condition: (_, { getState }) => {
      const isLoading = getState()?.getRequestOtp?.loading;
      return !isLoading;
    },
  },
);

const getRequestOtpSlice = (state = initialState, action) => {
  switch (action.type) {
    case getRequestOtp.pending.type:
      return { ...state, loading: true, error: null, success: false };
    case getRequestOtp.fulfilled.type:
      return { ...state, loading: false, success: true, data: action.payload };
    case getRequestOtp.rejected.type:
      return {
        ...state,
        loading: false,
        error: action.payload || DEFAULT_ERROR_MESSAGE,
      };
    default:
      return state;
  }
};

export default getRequestOtpSlice;
