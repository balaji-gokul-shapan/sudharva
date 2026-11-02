import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const extractOrder = (payload) => {
  if (!payload || typeof payload !== "object") return null;
  return payload.order || payload.data || payload.result || payload;
};

const initialState = {
  loading: false,
  error: null,
  order: null,
  response: null,
  success: false,
};

export const createPaymentOrder = createAsyncThunk(
  "payment/createPaymentOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const options = {
        method: "POST",
        url: "/api/payments/create-order",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          participant_reference: orderData?.participant_reference || "",
        },
      };

      const { data } = await axios.request(options);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const createPaymentOrderSlice = createSlice({
    name: "createPaymentOrder",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(createPaymentOrder.pending, (state) => {
          state.loading = true;
          state.error = null;
          state.success = false;
        })
        .addCase(createPaymentOrder.fulfilled, (state, action) => {
          state.loading = false;
          state.response = action.payload;
          state.order = extractOrder(action.payload);
          state.error = null;
          state.success = true;
        })
        .addCase(createPaymentOrder.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
          state.response = null;
          state.success = false;
        });
    }
})

export const selectCreatePaymentOrder = (state) => state.createPaymentOrder;
export const selectPaymentOrder = (state) => state.createPaymentOrder?.order;
export const selectCreatePaymentOrderLoading =
  (state) => state.createPaymentOrder?.loading;

export default createPaymentOrderSlice.reducer;
