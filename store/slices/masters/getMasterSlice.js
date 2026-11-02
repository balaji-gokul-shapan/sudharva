import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  error: null,
  success: false,
  data: null,
};

const getMasterValuesUrl = () => "/api/masters/master-values";

export const getMasterData = createAsyncThunk(
  "master/getMasterData",
  async (_, thunkAPI) => {
    const { rejectWithValue, signal } = thunkAPI;
    try {
      const response = await axios.get(getMasterValuesUrl(), {
        signal,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to fetch master data",
      );
    }
  },
  {
    condition: (_, { getState }) => {
      const isLoading = getState()?.master?.loading;
      return !isLoading;
    },
  },
);

const getMasterSlice = createSlice({
  name: "master",
  initialState,
  reducers: {
    resetMasterState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMasterData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.data = null;
      })
      .addCase(getMasterData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.data = action.payload ?? null;
      })
      .addCase(getMasterData.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to fetch master data";
        state.success = false;
        state.data = null;
      });
  },
});

export const { resetMasterState } = getMasterSlice.actions;
export default getMasterSlice.reducer;
