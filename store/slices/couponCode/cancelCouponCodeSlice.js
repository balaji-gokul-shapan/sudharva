import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { extractApiErrorMessage } from "@/store/utils/apiError";

const initialState = {
  loading: false,
  error: null,
  success: false,
  data: null,
  response: null,
};
const ACCESS_TOKEN_KEY = "auth.accessToken";

const readStoredAccessToken = () => {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(ACCESS_TOKEN_KEY) || "";
};


const cancelCouponCodeOptions = (requestBody, token = "") => ({
  method: "POST",
  url: "/api/coupons/cancel",
  headers: {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
  data: requestBody,
});

export const cancelCouponCode = createAsyncThunk(
  "couponCode/cancel",
  async (couponData, { rejectWithValue, getState }) => {
    try {
      const stateAccessToken = getState()?.userRefreshToken?.accessToken || "";
      const accessToken = stateAccessToken || readStoredAccessToken();
      const normalizedCouponCode = String(
        couponData?.coupon_code ?? couponData?.couponCode ?? "",
      )
        .trim()
        .replace(/\s+/g, "");

      const requestBody = {
        participant_reference:
          couponData?.participant_reference ||
          couponData?.participantReference ||
          "",
        coupon_code: normalizedCouponCode,
      };

      if (!requestBody.participant_reference) {
        return rejectWithValue("Participant reference is required");
      }

      if (!requestBody.coupon_code) {
        return rejectWithValue("Coupon code is required");
      }

      const options = cancelCouponCodeOptions(requestBody, accessToken);
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        extractApiErrorMessage(error, {
          fallback: "Failed to cancel coupon code",
        })
      );
    }
  },
);
const cancelCouponCodeSlice = createSlice({
  name: "cancelCouponCode",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(cancelCouponCode.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(cancelCouponCode.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.response = action.payload;
        state.data =
          action.payload?.data ||
          action.payload?.result ||
          action.payload;
      })
      .addCase(cancelCouponCode.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.response = null;
        state.data = null;
        state.error = action.payload || "Failed to cancel coupon code";
      });
  },
});

export default cancelCouponCodeSlice.reducer;
