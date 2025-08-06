import { createSlice } from "@reduxjs/toolkit";

const cartSlic=createSlice({
    name:'cart',
    initialState:{
        cart:null,
        
    },
    reducers:{
        setCart(state,action){
            state.cart=action.payload
           
        }
    }
})

export const {setCart} =cartSlic.actions
export default cartSlic.reducer