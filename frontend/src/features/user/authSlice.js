import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const userRegister = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue, dispatch }) => {
    try {
      const config = {
        headers: {
          Accept:'application/json',
          'Content-Type': 'application/json',
        },
      }
      await axios.post(
        '/api/users/register/',
        { name, email, password },
        config
      )
      dispatch(userLogin({email, password}))
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
  }
)
export const userLogin = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
      try {
        const config = {
          headers: {
              'Content-type': 'application/json'
          }
      }

        const { data } = await axios.post(
            '/api/users/login/',
            { 'username': email, 'password': password },
            config
        )

        // store user's token in local storage
        localStorage.setItem('userInfo', JSON.stringify(data))
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

export const userProfile = createAsyncThunk(
  'auth/profile',
  async ({id}, {getState, rejectWithValue} ) =>{
    try{
      const state = getState()
      const {userInfo} = state.auth
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        }
      }

      const { data } = await axios.post(
        `/api/users/${id}/`,
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
const initialState = {
    loading: false,
    userInfo: null,
    token: localStorage.getItem('userInfo') ? localStorage.getItem('userInfo'): null,
    error: null,
    success: false,
  }
  
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
        localStorage.removeItem('userInfo')
        state.loading = false
        state.userInfo = null
        state.token = null
        state.error = null
      },
  },
  extraReducers:(builder) => {
    builder
    .addCase(userRegister.pending, (state)=>{
        state.loading = true
        state.error = null
    })
    .addCase(userRegister.fulfilled, (state, { payload })=>{
        state.loading = false
        state.success = true
    })
    .addCase(userRegister.rejected, (state, { payload })=>{
        state.loading = false
        state.error = payload
    })
    .addCase(userLogin.pending, (state) =>{
        state.loading = true
        state.error = null
    })
    .addCase(userLogin.fulfilled, (state, { payload })=>{
        state.loading = false
        state.userInfo = payload
        state.token = payload.token
    })
    .addCase(userLogin.rejected, (state, { payload })=>{
        state.loading = false
        state.error = payload
    })
  },
})
const authReducer = authSlice.reducer
export const { logout } = authSlice.actions
export default authReducer