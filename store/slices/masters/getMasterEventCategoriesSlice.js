import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { extractApiErrorMessage } from "../../utils/apiError";

const initialState = {
  loading: false,
  error: null,
  success: false,
  data: [],
};

const getRunnerCategoriesUrl = () => "/api/masters/runner-categories";
const getRunnerCategoriesUrlWithSlash = () => "/api/masters/runner-categories/";

const extractCategories = (payload) => {
  const data = payload?.data ?? payload;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.registration_category)) return data.registration_category;
  if (Array.isArray(data?.runner_categories)) return data.runner_categories;

  return [];
};

export const getMasterEventCategories = createAsyncThunk(
  "masterEventCategories/getMasterEventCategories",
  async (_, { rejectWithValue, signal }) => {
    try {
      const response = await axios.get(getRunnerCategoriesUrl(), { signal });
      return extractCategories(response?.data);
    } catch (error) {
      if (error?.response?.status === 404) {
        try {
          const retryResponse = await axios.get(getRunnerCategoriesUrlWithSlash(), {
            signal,
          });
          return extractCategories(retryResponse?.data);
        } catch (retryError) {
          return rejectWithValue(
            extractApiErrorMessage(retryError, {
              fallback: "Failed to fetch event categories",
            }),
          );
        }
      }

      return rejectWithValue(
        extractApiErrorMessage(error, {
          fallback: "Failed to fetch event categories",
        }),
      );
    }
  },
);

const getMasterEventCategoriesSlice = createSlice({
  name: "masterEventCategories",
  initialState,
  reducers: {
    resetMasterEventCategoriesState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMasterEventCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getMasterEventCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.data = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getMasterEventCategories.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to fetch event categories";
        state.success = false;
        state.data = [];
      });
  },
});

export const { resetMasterEventCategoriesState } =
  getMasterEventCategoriesSlice.actions;

export const selectMasterEventCategoriesState = (state) =>
  state.masterEventCategories;
export const selectMasterEventCategoriesData = (state) =>
  state.masterEventCategories?.data ?? [];

export default getMasterEventCategoriesSlice.reducer;