
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  userInfo: null,
  loading: false,
  success: false,
  error: null,
};
const options = {
  method: 'POST',
  url: '/api/auth/runner/token',
  headers: {
    'Content-Type': 'application/json'
  },
  data: {
    email: '',
    password: ''
  }
}

export const loginUser = createAsyncThunk(
  "userLogin/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      // Replace this with your actual login API call
      const response = await axios({ ...options, data: { email, password } });
      const data = response.data;
      if (response.status !== 200) {
        throw new Error(data.message || "Login failed");
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const userLoginSlice = createSlice({
  name: "userLogin",
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.userInfo = action.payload;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.userInfo = null;
      state.success = false;
      state.error = null;
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout } = userLoginSlice.actions;
export default userLoginSlice.reducer;