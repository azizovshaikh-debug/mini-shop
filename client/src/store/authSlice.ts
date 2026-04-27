import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:3000';

export const login = createAsyncThunk('auth/login', async (data: { email: string; password: string }) => {
  const res = await axios.post(API + '/auth/login', data);
  localStorage.setItem('token', res.data.access_token);
  return res.data;
});

export const register = createAsyncThunk('auth/register', async (data: { email: string; password: string }) => {
  const res = await axios.post(API + '/auth/register', data);
  return res.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null as any,
    token: localStorage.getItem('token'),
    error: null as string | null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.access_token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(login.rejected, (state) => {
        state.error = 'Неверный email или пароль';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
