import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  PINCODE_PATTERN,
  getPincodeDetails,
  normalizePincode,
} from "@/components/api/getPincode";

const EMPTY_ENTRY = Object.freeze({
  status: "idle",
  data: null,
  error: "",
  lastFetchedAt: null,
});

const initialState = {
  byCode: {},
};

export const fetchPincodeByCode = createAsyncThunk(
  "pincode/fetchByCode",
  async ({ pincode }, { rejectWithValue, signal }) => {
    const normalized = normalizePincode(pincode);

    if (!PINCODE_PATTERN.test(normalized)) {
      return rejectWithValue("Enter a valid 6-digit pincode.");
    }

    try {
      const data = await getPincodeDetails(normalized, signal);
      return { normalized, data };
    } catch (error) {
      if (error?.name === "AbortError") {
        return rejectWithValue("aborted");
      }

      return rejectWithValue(
        error?.message || "Unable to look up this pincode.",
      );
    }
  },
  {
    condition: ({ pincode, force = false }, { getState }) => {
      if (force) return true;

      const normalized = normalizePincode(pincode);
      if (!PINCODE_PATTERN.test(normalized)) return false;

      const entry = getState()?.pincode?.byCode?.[normalized];
      if (!entry) return true;
      if (entry.status === "loading") return false;
      if (entry.status === "success") return false;
      return true;
    },
  },
);

const pincodeSlice = createSlice({
  name: "pincode",
  initialState,
  reducers: {
    clearPincodeEntry(state, action) {
      const normalized = normalizePincode(action.payload);
      if (!normalized) return;
      delete state.byCode[normalized];
    },
    clearAllPincodeEntries(state) {
      state.byCode = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPincodeByCode.pending, (state, action) => {
        const normalized = normalizePincode(action.meta.arg?.pincode);
        if (!normalized) return;

        state.byCode[normalized] = {
          status: "loading",
          data: null,
          error: "",
          lastFetchedAt: state.byCode[normalized]?.lastFetchedAt ?? null,
        };
      })
      .addCase(fetchPincodeByCode.fulfilled, (state, action) => {
        const { normalized, data } = action.payload;
        state.byCode[normalized] = {
          status: "success",
          data,
          error: "",
          lastFetchedAt: Date.now(),
        };
      })
      .addCase(fetchPincodeByCode.rejected, (state, action) => {
        const normalized = normalizePincode(action.meta.arg?.pincode);
        if (!normalized) return;

        // Keep an idle entry after abort so a later lookup can re-run cleanly.
        if (action.payload === "aborted") {
          state.byCode[normalized] = {
            ...EMPTY_ENTRY,
            lastFetchedAt: state.byCode[normalized]?.lastFetchedAt ?? null,
          };
          return;
        }

        state.byCode[normalized] = {
          status: "error",
          data: null,
          error:
            action.payload || action.error?.message || "Unable to look up this pincode.",
          lastFetchedAt: state.byCode[normalized]?.lastFetchedAt ?? null,
        };
      });
  },
});

export const { clearPincodeEntry, clearAllPincodeEntries } =
  pincodeSlice.actions;

export const selectPincodeState = (state) => state.pincode;

export const selectPincodeEntryByCode = (state, pincode) => {
  const normalized = normalizePincode(pincode);
  if (!PINCODE_PATTERN.test(normalized)) return EMPTY_ENTRY;
  return state.pincode.byCode[normalized] || EMPTY_ENTRY;
};

export default pincodeSlice.reducer;
