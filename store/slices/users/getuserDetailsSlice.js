import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { pickUserRegistration } from "@/lib/users/registrationPayload";

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
  async ({ token, query } = {}, { getState, rejectWithValue }) => {
    const stateToken = getState()?.userRefreshToken?.accessToken || "";
    const accessToken = token || stateToken || getStoredAccessToken();

    if (!accessToken) {
      return rejectWithValue("No access token available.");
    }

    const requestParams = {
      ...(query || {}),
      ...(query?.userId ? { user_id: query?.userId } : {}),
    };

    try {
      const response = await axios.request({
        ...options,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: requestParams,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Unable to fetch user details.",
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
