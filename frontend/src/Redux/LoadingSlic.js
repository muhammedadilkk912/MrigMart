import {createSlice} from '@reduxjs/toolkit'
const LoadingSlic= createSlice({
    name:'loading',
    initialState:{
        isLoading:false
      
    },
    reducers:{
         showLoading(state,action){
            console.log("insid e the show loading")
            state.isLoading=true

        },
        hideLoading(state,action){
            console.log("hide loading")
            state.isLoading=false

        }
    }


});
export const {showLoading,hideLoading}=LoadingSlic.actions;
export default LoadingSlic.reducer;


