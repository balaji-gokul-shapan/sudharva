import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { refreshUserToken } from "../users/userRefreshTokenSlice";

const ACCESS_TOKEN_KEY = "auth.accessToken";

const readStoredAccessToken = () => {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(ACCESS_TOKEN_KEY) || "";
};

const initialState = {
  loading: false,
  error: null,
  success: false,
  data: null,
  response: null,
};

const getCancelBibErrorMessage = (error) => {
  const responseData = error?.response?.data;

  return (
    responseData?.message ||
    responseData?.detail ||
    responseData?.error ||
    error?.message ||
    "Failed to cancel bib number"
  );
};

const getCancelBibOptions = (participantReference, token = "") => ({
  method: "POST",
  url: "/api/registrations/premium-bib/cancel",
  headers: {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
  data: {
    participant_reference: participantReference,
  },
});

export const cancelBibNumber = createAsyncThunk(
  "bibNumber/cancelBibNumber",
  async (participantReference, { rejectWithValue, dispatch, getState }) => {
    const normalizedReference = String(
      participantReference?.participant_reference ||
        participantReference?.participantReference ||
        participantReference ||
        "",
    ).trim();

    if (!normalizedReference) {
      return rejectWithValue("Participant reference is required");
    }

    const stateAccessToken = getState()?.userRefreshToken?.accessToken || "";
    const accessToken = stateAccessToken || readStoredAccessToken();

    try {
      const options = getCancelBibOptions(normalizedReference, accessToken);
      const { data } = await axios.request(options);
      return data;
    } catch (error) {
      const status = error?.response?.status;
      const authMessage = String(
        error?.response?.data?.detail || error?.response?.data?.message || "",
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
            const retryOptions = getCancelBibOptions(
              normalizedReference,
              refreshedAccessToken,
            );
            const { data } = await axios.request(retryOptions);
            return data;
          }
        } catch {
          // Fall through to default error handling.
        }
      }

      return rejectWithValue(getCancelBibErrorMessage(error));
    }
  },
);

const cancelBibNumberSlice = createSlice({
  name: "cancelBibNumber",
  initialState,
  reducers: {
    resetCancelBibNumberState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(cancelBibNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(cancelBibNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.response = action.payload;
        state.data = action.payload?.data || action.payload?.result || action.payload;
      })
      .addCase(cancelBibNumber.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload || action.error?.message || "Failed to cancel bib number";
      });
  },
});

export const { resetCancelBibNumberState } = cancelBibNumberSlice.actions;

export const selectCancelBibNumberState = (state) => state.cancelBibNumber;
export const selectCancelBibNumberLoading = (state) =>
  state.cancelBibNumber?.loading;
export const selectCancelBibNumberData = (state) =>
  state.cancelBibNumber?.data;

export default cancelBibNumberSlice.reducer;