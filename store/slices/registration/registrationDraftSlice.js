import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stepIndex: 0,
  form: null,
};

const registrationDraftSlice = createSlice({
  name: "registrationDraft",
  initialState,
  reducers: {
    saveRegistrationDraft(state, action) {
      const { stepIndex, form } = action.payload ?? {};

      if (typeof stepIndex === "number") {
        state.stepIndex = stepIndex;
      }

      if (form && typeof form === "object") {
        state.form = form;
      }
    },
    clearRegistrationDraft() {
      return initialState;
    },
  },
});

export const { saveRegistrationDraft, clearRegistrationDraft } =
  registrationDraftSlice.actions;

export default registrationDraftSlice.reducer;