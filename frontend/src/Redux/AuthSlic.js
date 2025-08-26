import { createSlice } from "@reduxjs/toolkit";

const authSlice=createSlice({
    name:'auth',
    initialState:{
    isAuthenticate:false,
    wishlist:[]
    },
    reducers:{
        setLogin(state,action){
            state.isAuthenticate=true
        },
        setLogout(state,action){
            state.isAuthenticate=false
        },
        setWishlist(state,action){
            state.wishlist=action.payload
        },
        AddToWishlist(state,action){
            state.wishlist.push(action.payload)
        },
        RemoveToWishlist(state,action){
            state.wishlist=state.wishlist.filter((item)=>item !== action.payload)
        }
    }
});

export const{setLogin,setLogout,setWishlist,AddToWishlist,RemoveToWishlist}=authSlice.actions 
export default authSlice.reducer
