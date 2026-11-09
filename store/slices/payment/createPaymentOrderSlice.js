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
          ...(orderData?.payable_amount !== undefined
            ? { payable_amount: Number(orderData.payable_amount) }
            : {}),
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
      const authMessage = String(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "",
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

export default createPaymentOrderSlice.reducer;
