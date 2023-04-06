import axios from "axios";
import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";

export const deleteCartItem = createAsyncThunk(
    'cart/deleteCartItem',
    async (id, {getState, rejectWithValue, dispatch} ) =>{
      try{
        const state = getState()
        const {userInfo} = state.auth
        const config = {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
          }
        }
        const data = await axios.delete(
          `/api/users/cart/cartitems/${id}`,
          config
        )
      } catch (error) {
        if (error.response && error.response.data.message) {
          return rejectWithValue(error.response.data.message)
        } else {
          return rejectWithValue(error.message)
        }
      }
    }
  )

export const getCart = createAsyncThunk(
  'cart/getCart',
    async (auth, {getState, rejectWithValue} ) =>{
      try{
        // const state = getState()
        const {userInfo} = auth
        const config = {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
          }
        }
        const { data } = await axios.get(
          `/api/users/cart/`,
          config
        )
        return data  
      } catch (error) {
        if (error.response && error.response.data.message) {
          return rejectWithValue(error.response.data.message)
        } else {
          return rejectWithValue(error.message)
        }
      }
    }
  )

export const addCartItem = createAsyncThunk(
    'cart/addCartItem',
    async (data, {getState, rejectWithValue} ) =>{
      try{
        const state = getState()
        const {userInfo} = state.auth
        const config = {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
          }
        }
        await axios.post(
          `/api/users/cart/add/`,
          data,
          config
        )
      } catch (error) {
        if (error.response && error.response.data.message) {
          return rejectWithValue(error.response.data.message)
        } else {
          return rejectWithValue(error.message)
        }
      }
    }
)


 const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: [],
        shippingAddress: localStorage.getItem('shippingAddress') ? localStorage.getItem('shippingAddress'): null,
        loading: false,
        success: false,
        error: null,
    },
    reducers: {
        saveShippingAddress : (state, {payload})=>{
            state.shippingAddress = localStorage.setItem('shippingAddress', JSON.stringify(payload))
        },
        resetItems: (state)=> {
          state.success = false
        }
    },
    extraReducers:(builder) => {
        builder
        .addCase(getCart.pending, (state)=> {
            state.loading = true
            state.error = null
        })
        .addCase(getCart.rejected, (state, {payload})=> {
            state.loading = false
            state.error = payload
        })
        .addCase(getCart.fulfilled, (state, {payload})=> {
            state.loading = false
            state.error = null
            state.cartItems = payload
        })
        .addCase(deleteCartItem.pending, (state)=> {
          state.loading = true
          state.error = null
        })
        .addCase(deleteCartItem.rejected, (state, {payload})=> {
            state.loading = false
            state.error = payload
            state.success = false
        })
        .addCase(deleteCartItem.fulfilled, (state, {payload})=> {
          state.loading = false
          state.error = null
          state.success = true
        })
        .addCase(addCartItem.pending, (state)=> {
          state.loading = true
          state.error = null
          state.success= false
        })
        .addCase(addCartItem.rejected, (state, {payload})=> {
          state.loading = false
          state.error = payload
          state.success = false
        })
        .addCase(addCartItem.fulfilled, (state, {payload})=> {
          state.loading = false
          state.error = null
          state.success = true
        })
    }
 })

 const cartReducer = cartSlice.reducer
 export default cartReducer
 export const {saveShippingAddress, resetItems} = cartSlice.actions