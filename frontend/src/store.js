import { configureStore } from '@reduxjs/toolkit';

import productReducer from './features/product/productSlice'
import authReducer from './features/user/authSlice';
import cartReducer from './features/cart/cartSlice';
import modalReducer from './features/modalSlice';
import orderReducer from './features/orderSlice';



const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null

  const shippingAddressFromStorage = localStorage.getItem("shippingAddress")
  ? JSON.parse(localStorage.getItem("shippingAddress"))
  : null

const initialState = {
  auth: { userInfo: userInfoFromStorage, shippingAddress: shippingAddressFromStorage}
}

export const store = configureStore({
    reducer:{
        products: productReducer,
        auth: authReducer,
        cart: cartReducer,
        modal: modalReducer,
        order: orderReducer
    },
    preloadedState: initialState
})
