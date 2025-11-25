import { createSlice } from "@reduxjs/toolkit";

const cartSlic=createSlice({
    name:'cart',
    initialState:{
        cart:null,
        CartTotal:null
        
    },
    reducers:{
        setCart(state,action){
            state.cart=action.payload
           
        },
        setCartTotal(state,action){
            state.CartTotal=action.payload
        },
        removeCartItem(state,action){
            let itemId=action.payload
            state.CartTotal=state.CartTotal.filter((item)=>item.product!==itemId)

        }
    }
})

export const {setCart,setCartTotal,removeCartItem} =cartSlic.actions
export default cartSlic.reducer