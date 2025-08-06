import { createSlice } from "@reduxjs/toolkit";

const authSlice=createSlice({
    name:'auth',
    initialState:{
    isAuthenticate:false,
    },
    reducers:{
        setLogin(state,action){
            state.isAuthenticate=true
        },
        setLogout(state,action){
            state.isAuthenticate=false
        }
    }
});

export const{setLogin,setLogout}=authSlice.actions 
export default authSlice.reducer
