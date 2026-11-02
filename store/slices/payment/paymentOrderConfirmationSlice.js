import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  error: null,
  order: null,
  response: null,
  success: false,
};

const extractConfirmation = (payload) => {
  if (!payload || typeof payload !== "object") return null;
  return payload.order || payload.data || payload.result || payload;
};

export const confirmPaymentOrder = createAsyncThunk(
  "payment/orderConfirmation",
  async (orderData, { rejectWithValue }) => {
    const payload = {
      razorpay_order_id: orderData?.razorpay_order_id || "",
      razorpay_payment_id: orderData?.razorpay_payment_id || "",
      razorpay_signature: orderData?.razorpay_signature || "",
    };

    if (
      !payload.razorpay_order_id ||
      !payload.razorpay_payment_id ||
      !payload.razorpay_signature
    ) {
      return rejectWithValue("Missing Razorpay confirmation fields");
    }

    try {
      const response = await axios.request({
        method: "POST",
        url: "/api/payments/confirm",
        headers: {
          "Content-Type": "application/json",
        },
        data: payload,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error.message || "Payment confirmation failed",
      );
    }
  },
);

const paymentOrderConfirmationSlice = createSlice({
  name: "paymentOrderConfirmation",
  initialState,
  reducers: {
    resetPaymentOrderConfirmation: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(confirmPaymentOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(confirmPaymentOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload;
        state.order = extractConfirmation(action.payload);
        state.success = true;
        state.error = null;
      })
      .addCase(confirmPaymentOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Request failed";
        state.success = false;
      });
  },
});

export const { resetPaymentOrderConfirmation } =
  paymentOrderConfirmationSlice.actions;

export const selectPaymentOrderConfirmation =
  (state) => state.paymentOrderConfirmation;
export const selectPaymentConfirmationResponse =
  (state) => state.paymentOrderConfirmation?.response;
export const selectPaymentConfirmationLoading =
  (state) => state.paymentOrderConfirmation?.loading;

export default paymentOrderConfirmationSlice.reducer;