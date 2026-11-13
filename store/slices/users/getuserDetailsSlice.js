import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { pickUserRegistration } from "@/lib/users/registrationPayload";
import { extractApiErrorMessage } from "../../utils/apiError";
import { refreshUserToken } from "./userRefreshTokenSlice";

const ACCESS_TOKEN_KEY = "auth.accessToken";

const initialState = {
  details: null,
  loading: false,
  success: false,
  error: null,
};

const options = {
  method: "GET",
  url: "/api/auth/runner/me/registrations",
};

const getStoredAccessToken = () => {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(ACCESS_TOKEN_KEY) || "";
};

export const getUserDetails = createAsyncThunk(
  "users/getUserDetails",
  async ({ token, query } = {}, { getState, rejectWithValue, dispatch }) => {
    const stateToken = getState()?.userRefreshToken?.accessToken || "";
    const accessToken = token || stateToken || getStoredAccessToken();

    if (!accessToken) {
      return rejectWithValue("No access token available.");
    }

    const requestParams = {
      ...(query || {}),
      ...(query?.userId ? { user_id: query?.userId } : {}),
    };

    const requestUserDetails = async (requestToken) => {
      return axios.request({
        ...options,
        headers: {
          Authorization: `Bearer ${requestToken}`,
        },
        params: requestParams,
      });
    };

    try {
      const response = await requestUserDetails(accessToken);

      return response.data;
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
            getStoredAccessToken();

          if (refreshedAccessToken) {
            const retryResponse = await requestUserDetails(refreshedAccessToken);
            return retryResponse.data;
          }
        } catch {
          return rejectWithValue(
            "Session expired. Please log in again to view your details.",
          );
        }
      }

      return rejectWithValue(
        extractApiErrorMessage(error, {
          fallback: "Unable to fetch user details.",
        }),
      );
    }
  },
);

const getUserDetailsSlice = createSlice({
  name: "getUserDetails",
  initialState,
  reducers: {
    clearUserDetails: (state) => {
      state.details = null;
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.details = action.payload;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload || action.error?.message || "Unable to fetch user details.";
      });
  },
});

export const { clearUserDetails } = getUserDetailsSlice.actions;
export const selectUserDetailsState = (state) => state.getUserDetails;
export const selectUserDetails = (state) => state.getUserDetails?.details;
export const selectUserRegistration = (state) =>
  pickUserRegistration(state.getUserDetails?.details);
export default getUserDetailsSlice.reducer;
