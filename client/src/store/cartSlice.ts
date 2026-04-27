import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:3000';

const getHeaders = () => ({
  Authorization: 'Bearer ' + localStorage.getItem('token'),
});

export const fetchCart = createAsyncThunk('cart/fetch', async () => {
  const res = await axios.get(API + '/cart', { headers: getHeaders() });
  return res.data;
});

export const addToCart = createAsyncThunk('cart/add', async (data: { productId: number; quantity?: number }) => {
  const res = await axios.post(API + '/cart', data, { headers: getHeaders() });
  return res.data;
});

export const removeFromCart = createAsyncThunk('cart/remove', async (id: number) => {
  await axios.delete(API + '/cart/item/' + id, { headers: getHeaders() });
  return id;
});

export const checkout = createAsyncThunk('cart/checkout', async () => {
  const res = await axios.post(API + '/orders', {}, { headers: getHeaders() });
  return res.data;
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [] as any[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((item: any) => item.id !== action.payload);
      })
      .addCase(checkout.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default cartSlice.reducer;
