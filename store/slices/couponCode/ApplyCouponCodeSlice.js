import { extractApiErrorMessage } from "@/store/utils/apiError";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

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


const getCouponCode = (requestBody, token = "") => ({
  method: "POST",
  url: "/api/coupons/apply",
  headers: {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
  data: requestBody,
});

export const applyCouponCode = createAsyncThunk(
  "couponCode/apply",
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

      const options = getCouponCode(requestBody, accessToken);
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
    //   return rejectWithValue(getReadableCouponError(error));
     return rejectWithValue(
       extractApiErrorMessage(error, {
         fallback: "Failed to apply coupon code",
       })
     );
    }
  },
);

const applyCouponCodeSlice = createSlice({
  name: "applyCouponCode",
  initialState,
  reducers: {
    resetApplyCouponCodeState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.data = null;
      state.response = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyCouponCode.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(applyCouponCode.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.response = action.payload;
        state.data =
          action.payload?.data ||
          action.payload?.result ||
          action.payload;
      })
      .addCase(applyCouponCode.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.response = null;
        state.data = null;
        state.error = action.payload || "Failed to apply coupon code";
      });
  },
});

export const { resetApplyCouponCodeState } = applyCouponCodeSlice.actions;

export const selectApplyCouponCodeState = (state) => state.applyCouponCode;
export const selectApplyCouponCodeLoading = (state) =>
  state.applyCouponCode?.loading;
export const selectApplyCouponCodeError = (state) => state.applyCouponCode?.error;
export const selectApplyCouponCodeSuccess = (state) =>
  state.applyCouponCode?.success;
export const selectApplyCouponCodeData = (state) => state.applyCouponCode?.data;

export default applyCouponCodeSlice.reducer;
