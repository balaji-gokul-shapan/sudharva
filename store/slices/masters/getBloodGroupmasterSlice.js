import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { extractApiErrorMessage } from "../../utils/apiError";

const initialState = {
  loading: false,
  error: null,
  success: false,
  data: [],
};

const getBloodGroupMasterUrl = () => "/api/masters/blood_group";
const getBloodGroupMasterUrlWithSlash = () => "/api/masters/blood_group/";

const extractBloodGroups = (payload) => {
  const data = payload?.data ?? payload;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.blood_group)) return data.blood_group;
  if (Array.isArray(data?.blood_groups)) return data.blood_groups;

  return [];
};

export const getBloodGroupMaster = createAsyncThunk(
  "bloodGroupMaster/getBloodGroupMaster",
  async (_, { rejectWithValue, signal }) => {
    try {
      const response = await axios.get(getBloodGroupMasterUrl(), { signal });
      return extractBloodGroups(response?.data);
    } catch (error) {
      if (error?.response?.status === 404) {
        try {
          const retryResponse = await axios.get(getBloodGroupMasterUrlWithSlash(), {
            signal,
          });
          return extractBloodGroups(retryResponse?.data);
        } catch (retryError) {
          return rejectWithValue(
            extractApiErrorMessage(retryError, {
              fallback: "Failed to fetch blood group master",
            }),
          );
        }
      }

      return rejectWithValue(
        extractApiErrorMessage(error, {
          fallback: "Failed to fetch blood group master",
        }),
      );
    }
  },
);

const getBloodGroupMasterSlice = createSlice({
  name: "bloodGroupMaster",
  initialState,
  reducers: {
    resetBloodGroupMasterState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBloodGroupMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getBloodGroupMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.data = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getBloodGroupMaster.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to fetch blood group master";
        state.success = false;
        state.data = [];
      });
  },
});

export const { resetBloodGroupMasterState } = getBloodGroupMasterSlice.actions;

export const selectBloodGroupMasterState = (state) => state.bloodGroupMaster;
export const selectBloodGroupMasterData = (state) =>
  state.bloodGroupMaster?.data ?? [];

export default getBloodGroupMasterSlice.reducer;