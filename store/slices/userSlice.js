import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

axios.defaults.baseURL = "https://vulpes-backend.onrender.com/";

const setAuthHeader = token => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearAuthHeader = () => {
  axios.defaults.headers.common.Authorization = '';
};

const initialState = {
  isLoggedIn: false,
  token: null,
  info: null,
};

export const logIn = createAsyncThunk(
  'user/logIn',
  async (credentials, { getState }) => {
        try {
      const res = await axios.post('/auth/login', credentials);
      setAuthHeader(res.data.token);
      localStorage.setItem('auth', JSON.stringify(res.data));
      return res.data;
    } catch (error) {
      return error.message;
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logOut: (state) => {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder
    //   .addCase(register.fulfilled, (state, action) => {
    //     state.user = action.payload.user;
    //     state.token = action.payload.token;
    //     state.isLoggedIn = true;
    //   })
      .addCase(logIn.fulfilled, (state, action) => {
        state.info = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })
    //   .addCase(refreshUser.pending, state => {
    //     state.isRefreshing = true;
    //   })
    //   .addCase(refreshUser.fulfilled, (state, action) => {
    //     state.user = action.payload.user;
    //     state.isLoggedIn = true;
    //     state.isRefreshing = false;
    //   })
    //   .addCase(refreshUser.rejected, state => {
    //     state.isLoggedIn = false;
    //     state.isRefreshing = false;
    //   });
  },
});

export const { clearBarcodes } = userSlice.actions;
export default userSlice.reducer;