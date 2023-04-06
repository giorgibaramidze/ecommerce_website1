import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
    name: 'modal',
    initialState:{
        isOpen: false
    },
    reducers: {
        openModal: (state, action) => {
            state.isOpen = true
        },
        closeModal: (state, action) => {
            state.isOpen = false
        }
    }
})

const modelReducer = modalSlice.reducer
export const {openModal, closeModal} = modalSlice.actions
export default modelReducer