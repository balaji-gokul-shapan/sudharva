import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const extractRegistration = (payload) => {
  if (!payload || typeof payload !== "object") return null;
  return payload.data || payload.result || payload.registration || payload;
};

const initialState = {
  loading: false,
  error: null,
  success: false,
  data: null,
  response: null,
  requestPayload: null,
};

export const createRegistration = createAsyncThunk(
  "createRegistration",
  async (registrationData, thunkAPI) => {
    try {
      const response = await axios.post(
        "/api/registrations/create",
        registrationData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error?.message || "Registration failed",
      );
    }
  },
);

const createRegistrationSlice = createSlice({
  name: "createRegistration",
  initialState,
  reducers: {
    setCreateRegistrationSnapshot: (state, action) => {
      const requestPayload = action.payload?.requestPayload ?? null;
      const response = action.payload?.response ?? null;
      const dataCandidate = action.payload?.data ?? response;

      state.requestPayload = requestPayload;
      state.response = response;
      state.data = extractRegistration(dataCandidate);
      state.success = Boolean(state.data || state.response);
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRegistration.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.requestPayload = action.meta?.arg ?? null;
      })
      .addCase(createRegistration.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = extractRegistration(action.payload);
        state.response = action.payload;
        state.requestPayload = action.meta?.arg ?? state.requestPayload;
      })
      .addCase(createRegistration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Registration failed";
        state.response = null;
        state.success = false;
      });
  },
});

export const { setCreateRegistrationSnapshot } = createRegistrationSlice.actions;

export const selectCreateRegistrationState = (state) => state.createRegistration;
export const selectCreateRegistrationData = (state) => state.createRegistration?.data;
export const selectCreateRegistrationRequestPayload =
  (state) => state.createRegistration?.requestPayload;

export default createRegistrationSlice.reducer;
