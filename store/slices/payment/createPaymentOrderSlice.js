import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { refreshUserToken } from "../users/userRefreshTokenSlice";
import { extractApiErrorMessage } from "../../utils/apiError";

const ACCESS_TOKEN_KEY = "auth.accessToken";

const readStoredAccessToken = () => {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(ACCESS_TOKEN_KEY) || "";
};

const getPaymentOrderErrorMessage = (error) => {
  return extractApiErrorMessage(error, {
    fallback: "Unable to create payment order",
  });
};

const extractOrder = (payload) => {
  if (!payload || typeof payload !== "object") return null;
  return payload.order || payload.data || payload.result || payload;
};

const getRazorpayOrderConfig = (order) => {
  if (!order || typeof order !== "object") {
    return {
      key: "",
      orderId: "",
      amountPaise: "",
      totalAmountPaise: "",
      currency: "INR",
      notes: {},
      registrationAmount: "",
      premiumBibFee: "",
      premiumBibNumber: "",
      isPremium: false,
    };
  }

  return {
    key:
      order.rzpKey ||
      order.key ||
      order.key_id ||
      order.razorpay_key ||
      "",
    orderId: order.order_id || order.orderId || order.id || "",
    amountPaise: order.amount || order.amount_paise || "",
    totalAmountPaise:
      order.total_amount_paise || order.totalAmountPaise || order.amount || "",
    currency: order.currency || "INR",
    notes:
      order.notes && typeof order.notes === "object"
        ? order.notes
        : {},
    registrationAmount:
      order.registration_amount || order.registrationAmount || "",
    premiumBibFee: order.premium_bib_fee || order.premiumBibFee || "",
    premiumBibNumber:
      order.premium_bib_number || order.premiumBibNumber || "",
    isPremium: Boolean(order.is_premium || order.isPremium),
  };
};

const hasUsableOrder = (payload) => {
  const order = extractOrder(payload);
  if (!order || typeof order !== "object") return false;

  return Boolean(
    order.order_id ||
      order.orderId ||
      order.id ||
      order.rzpKey ||
      order.key ||
      order.key_id ||
      order.razorpay_key,
  );
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
  async (orderData, { rejectWithValue, dispatch, getState }) => {
    const stateAccessToken = getState()?.userRefreshToken?.accessToken || "";
    const accessToken = stateAccessToken || readStoredAccessToken();

    const requestPaymentOrder = async (token) => {
      const options = {
        method: "POST",
        url: "/api/payments/create-order",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        data: {
          participant_reference: orderData?.participant_reference || "",
          // ...(orderData?.payable_amount !== undefined
          //   ? { payable_amount: Number(orderData.payable_amount) }
          //   : {}),
          ...(orderData?.registration_status
            ? { registration_status: orderData.registration_status }
            : {}),
        },
      };

      return axios.request(options);
    };

    try {
      const { data } = await requestPaymentOrder(accessToken);
      return data;
    } catch (error) {
      const status = error?.response?.status;
      const responsePayload = error?.response?.data;

      // Some backends return 409 when an order already exists for the same
      // participant. If the response includes usable order data, treat it as
      // success so the UI can continue with that order.
      if (status === 409 && hasUsableOrder(responsePayload)) {
        return responsePayload;
      }

      // If this is a duplicate create-order call and we already have an order
      // in Redux state, reuse it to keep the flow idempotent.
      if (status === 409) {
        const existingOrder = getState()?.createPaymentOrder?.order || null;
        if (existingOrder && typeof existingOrder === "object") {
          return { order: existingOrder, reused: true };
        }
      }

      const authMessage = String(
        responsePayload?.detail || responsePayload?.message || "",
      ).toLowerCase();
      const isAuthFailure =
        status === 401 ||
        authMessage.includes("authentication") ||
        authMessage.includes("credentials");

      if (isAuthFailure) {
        try {
          const refreshResult = await dispatch(refreshUserToken()).unwrap();
          const refreshedAccessToken =
            refreshResult?.accessToken ||
            getState()?.userRefreshToken?.accessToken ||
            readStoredAccessToken();

          if (refreshedAccessToken) {
            const { data } = await requestPaymentOrder(refreshedAccessToken);
            return data;
          }
        } catch {
          // Fall through to return original auth error.
        }
      }

      return rejectWithValue(getPaymentOrderErrorMessage(error));
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
export const selectCreatePaymentOrderError =
  (state) => state.createPaymentOrder?.error;
export const selectRazorpayOrderConfig = (state) =>
  getRazorpayOrderConfig(state.createPaymentOrder?.order);

export default createPaymentOrderSlice.reducer;
