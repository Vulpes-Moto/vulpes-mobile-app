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
  isPending: false,
};

export const register = createAsyncThunk(
  'user/register',
  async (credentials, thunkAPI) => {
    try {
      const res = await axios.post('/auth/register', credentials);
      setAuthHeader(res.data.token);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const logIn = createAsyncThunk(
  'user/logIn',
  async (credentials) => {
        try {
      const res = await axios.post('/auth/login', credentials);
      setAuthHeader(res.data.token);
      return res.data;
    } catch (error) {
      return error.message;
    }
  }
);

export const refreshUser = createAsyncThunk(
  'user/refresh',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    let persistedToken = state.user.token;

    try {
      setAuthHeader(persistedToken);
      const res = await axios.post('/auth/current');
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logOut: (state) => {
      clearAuthHeader();
      state.isLoggedIn = false;
      state.token = null;
      state.info=  null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isPending = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.info = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })
      .addCase(register.rejected, (state) => {
        state.isPending = false;
        state.isLoggedIn = false;
      })
      .addCase(logIn.pending, (state) => {
        state.isPending = true;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.info = action.payload.user;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        state.isPending = false;
      })
      .addCase(logIn.rejected, state => {
        state.isLoggedIn = false;
        state.isPending = false;
      })
      .addCase(refreshUser.pending, state => {
        state.isRefreshing = true;
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.info = action.payload.user;
        state.isLoggedIn = true;
        state.isRefreshing = false;
      })
      .addCase(refreshUser.rejected, state => {
        state.isLoggedIn = false;
        state.isRefreshing = false;
      });
  },
});

export const { logOut } = userSlice.actions;
export default userSlice.reducer;