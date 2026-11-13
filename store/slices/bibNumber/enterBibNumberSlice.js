import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { refreshUserToken } from "../users/userRefreshTokenSlice";
import { extractApiErrorMessage } from "../../utils/apiError";

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

const extractBibPayload = (payload) => {
  if (!payload || typeof payload !== "object") return null;
  return payload.data || payload.result || payload.bib || payload;
};


const getEnterBibOptions = (requestBody, token = "") => ({
  method: "POST",
  url: "/api/registrations/premium-bib",
  headers: {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
  data: requestBody,
});

export const enterBibNumber = createAsyncThunk(
  "bibNumber/enterBibNumber",
  async (bibData, { rejectWithValue, dispatch, getState }) => {
    const stateAccessToken = getState()?.userRefreshToken?.accessToken || "";
    const accessToken = stateAccessToken || readStoredAccessToken();

    try {
      const requestBody = {
        participant_reference:
          bibData?.participant_reference || bibData?.participantReference || "",
        category_id: Number(bibData?.category_id ?? bibData?.categoryId ?? 1),
        bib_number: String(bibData?.bib_number ?? bibData?.bibNumber ?? "")
          .trim()
          .toUpperCase(),
      };

      const options = getEnterBibOptions(requestBody, accessToken);
      const { data } = await axios.request(options);

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
            const retryOptions = getEnterBibOptions(
              requestBody,
              refreshedAccessToken,
            );
            const { data } = await axios.request(retryOptions);
            return data;
          }
        } catch {
          // Fall through to default error extraction.
        }
      }

      return rejectWithValue(
        extractApiErrorMessage(error, {
          fallback: "Failed to submit bib number",
        }),
      );
    }
  },
);

const enterBibNumberSlice = createSlice({
  name: "enterBibNumber",
  initialState,
  reducers: {
    resetEnterBibNumberState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(enterBibNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(enterBibNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.response = action.payload;
        state.data = extractBibPayload(action.payload);
      })
      .addCase(enterBibNumber.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to submit bib number";
        state.success = false;
        state.response = null;
        state.data = null;
      });
  },
});

export const { resetEnterBibNumberState } = enterBibNumberSlice.actions;

export const selectEnterBibNumberState = (state) => state.enterBibNumber;
export const selectEnterBibNumberData = (state) => state.enterBibNumber?.data;
export const selectEnterBibNumberLoading = (state) =>
  state.enterBibNumber?.loading;

export default enterBibNumberSlice.reducer;
