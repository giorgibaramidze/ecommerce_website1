import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const getOrderDetails = createAsyncThunk(
    'order/getOrderDetails', 
    async (id, {getState, rejectWithValue}) => {
        try{
            const state = getState()
            const {userInfo} = state.auth
            const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
                }
            }
            const {data} = await axios.get(
                `/api/orders/${id}/`,
                config
            )
            return data
        }catch (error) {
            if (error.response && error.response.data.message) {
              return rejectWithValue(error.response.data.message)
            } else {
              return rejectWithValue(error.message)
            }
          }
    }
)

export const getOrderlist = createAsyncThunk(
    'order/getOrderList', 
    async (_, {getState, rejectWithValue}) => {
        try{
            const state = getState()
            const {userInfo} = state.auth
            const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
                }
            }
            const {data} = await axios.get(
                `/api/orders/order-list/`,
                config
            )
            return data
        }catch (error) {
            if (error.response && error.response.data.message) {
              return rejectWithValue(error.response.data.message)
            } else {
              return rejectWithValue(error.message)
            }
          }
    }
)


export const payOrder = createAsyncThunk(
    'order/payOrder', 
    async ({orderID, result}, {getState, rejectWithValue}) => {
        try{
            const state = getState()
            const {userInfo} = state.auth
            const config = {
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`
                }
            }
            const {data} = await axios.put(
                `/api/orders/${orderID}/pay/`,
                {result},
                config
            )
        }catch (error) {
            if (error.response && error.response.data.message) {
              return rejectWithValue(error.response.data.message)
            } else {
              return rejectWithValue(error.message)
            }
          }
    }
)


export const addOrder = createAsyncThunk(
    'order/addOrder', 
    async (order, {getState, rejectWithValue}) => {
        try{
            const state = getState()
            const {userInfo} = state.auth
            const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
                }
            }
            console.log(order)
            const {data} = await axios.post(
                `api/orders/add/`,
                order,
                config
            )
            return data
        }catch (error) {
            if (error.response && error.response.data.message) {
              return rejectWithValue(error.response.data.message)
            } else {
              return rejectWithValue(error.message)
            }
          }
    }
)


const orderSlice = createSlice({
    name: 'order',
    initialState: {
        loading: false,
        success: false,
        payLoading: false,
        paySuccess: false,
        payOrder: [],
        order: [],
        orderList: [],
        error: null
    },
    reducers:{
        clearOrder: (state, action)=>{
            state.order = []
            state.success = false
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(addOrder.pending, (state)=>{
            state.loading = true
            state.success = false
        })
        .addCase(addOrder.fulfilled, (state, {payload})=>{
            state.loading = false
            state.order = payload
            state.success = true
        })
        .addCase(addOrder.rejected, (state, {payload})=>{
            state.loading = false
            state.error = payload
            state.success = false
        })
        .addCase(getOrderDetails.pending, (state)=>{
            state.loading = true
            state.success = false
        })
        .addCase(getOrderDetails.fulfilled, (state, {payload})=>{
            state.loading = false
            state.order = payload
            state.success = true
        })
        .addCase(getOrderDetails.rejected, (state, {payload})=>{
            state.loading = false
            state.error = payload
            state.success = false
        })
        .addCase(payOrder.pending, (state)=>{
            state.payLoading = true
            state.success = false
        })
        .addCase(payOrder.fulfilled, (state, {payload})=>{
            state.payLoading = false
            state.success = true
        })
        .addCase(payOrder.rejected, (state, {payload})=>{
            state.payLoading = false
            state.error = payload
            state.success = false
        })
        .addCase(getOrderlist.pending, (state)=>{
            state.loading = true
            state.success = false
        })
        .addCase(getOrderlist.fulfilled, (state, {payload})=>{
            state.loading = false
            state.success = true
            state.orderList = payload
        })
        .addCase(getOrderlist.rejected, (state, {payload})=>{
            state.loading = false
            state.error = payload
            state.success = false
        })
    }
})
export const {clearOrder} = orderSlice.actions
const orderReducer = orderSlice.reducer
export default orderReducer
