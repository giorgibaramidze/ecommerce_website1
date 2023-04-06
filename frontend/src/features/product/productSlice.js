import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getProducts = createAsyncThunk(
    'products/getProducts',
    async (ordering) => {
      try {
        const {data} = await axios.get(`/api/products/${ordering ?? ' '}`);
        console.log(ordering, data)
        return (ordering && ordering === '?home=product' ? {homeProducts: data}: 
                ordering && ordering.includes('?search') ? {searchResulList: data} :
                {allProduct: data})
      } catch (error) {
        return error.response.data.details;
      }
    }
  );
  export const searchProduct = createAsyncThunk(
    'products/seatchProduct',
    async (search) => {
      try {
        const {data} = await axios.get(`/api/products/?search=${search}`);
        return data
      } catch (error) {
        return error;
      }
    }
  );
  export const getProductDetails = createAsyncThunk(
    'products/getProductsDetails',
    async (id) => {
      try {
        const {data} = await axios.get(`/api/products/${id}`);
        console.log(data)
        return data;
      } catch (error) {
        return error;
      }
    }
  );

  export const createProductReview = createAsyncThunk(
    'products/createProductReview',
    async ({productID, rating, comment}, {getState, rejectWithValue}) => {
      try {
        const state = getState()
        const {userInfo} = state.auth
        const config = {
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${userInfo.token}`
          }
        }
        const {data} = await axios.post(
          `/api/products/${productID}/reviews/`,
          {rating, comment},
          config
          );
          return data
      } catch (error) {
        if (error.response && error.response.data.message) {
          return rejectWithValue(error.response.data.message)
        } else {
          return rejectWithValue(error.message)
        }
      }
    }
  );

const productSlice = createSlice({
    name: 'products',
    initialState: { 
        products: [],
        allProduct: [],
        loading: false,
        reviewLoading: false,
        reviewSuccess:false,
        reviewError: null,
        productReview: [],
        searchResult: [],
        autoCompleteResult: [], 
        productDetails: [],
    },
    reducers: {
      removeSelectedProduct: (state) => {
        state.reviewError = null
        state.reviewSuccess = false
        state.searchResult = []
      },
      resetAll: (state) => {
        state.products = []
        state.searchResult = []
        state.productReview = []
      }
    },
    extraReducers: (builder) => {
      builder
      .addCase(getProducts.pending, (state) =>{
        state.loading = true
      })
      .addCase(getProducts.fulfilled, (state, {payload}) =>{
        state.loading = false
        state.products = payload?.homeProducts ?? state.products
        state.searchResult = payload?.searchResulList ?? state.searchResult
        state.allProduct = payload?.allProduct ?? state.allProduct
      })
      .addCase(getProducts.rejected, (state) =>{
        state.loading = false
      })
      .addCase(getProductDetails.pending, (state) =>{
        state.loading = true
      })
      .addCase(searchProduct.fulfilled, (state, {payload}) =>{
        state.autoCompleteResult = payload
      })
      .addCase(getProductDetails.fulfilled, (state, {payload}) =>{
        state.loading = false
        state.productDetails = payload
      })
      .addCase(createProductReview.pending, (state) =>{
        state.reviewLoading = true
      })
      .addCase(createProductReview.fulfilled, (state, {payload}) =>{
        state.reviewLoading = false
        state.reviewSuccess = true 
        state.productDetails.reviews = payload
      })
      .addCase(createProductReview.rejected, (state, {payload}) =>{
        state.reviewLoading = false
        state.reviewSuccess = false 
        state.reviewError = payload 
      })
    }
})
export const {removeSelectedProduct, resetAll} = productSlice.actions
const productReducer = productSlice.reducer
export default productReducer