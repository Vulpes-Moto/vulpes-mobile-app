import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

axios.defaults.baseURL = "https://vulpes-backend.onrender.com/";

const initialState = {
  scannedBarcodes: [],
};

export const addBarcode = createAsyncThunk(
  'barcode/addBarcode',
  async (barcode, { getState }) => {
    try {
      const existing = getState().barcode?.scannedBarcodes?.find(i => i.barcode === barcode);
      if (existing) {
        return { type: 'increment', barcode };
      }
      const res = await axios.post("/products/bybarcode", { barcode });
      const product = res.data.product;
      return {
        type: 'new',
        barcode,
        article: product?.article ?? '?',
        name: product?.name?.UA ?? '?',
      };
    } catch(error) {
      console.log('addBarcode catch:', error)
      return {
        type: 'new',
        barcode,
        article: '?',
        name: '?',
      };
    }
  }
);

const barcodeSlice = createSlice({
  name: 'barcode',
  initialState,
  reducers: {
    clearBarcodes: (state) => {
      state.scannedBarcodes = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addBarcode.fulfilled, (state, action) => {
      const payload = action.payload;
      if (payload.type === 'increment') {
        const item = state?.scannedBarcodes?.find(i => i.barcode === payload.barcode);
        if (item) item.count++;
      } else if (payload.type === 'new') {
        state.scannedBarcodes.push({
          barcode: payload.barcode,
          count: 1,
          article: payload.article,
          name: payload.name,
        });
      }
    });
  },
});

export const { clearBarcodes } = barcodeSlice.actions;
export default barcodeSlice.reducer;