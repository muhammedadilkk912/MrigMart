import { createSlice } from "@reduxjs/toolkit";


const SearchSlic=new createSlice({
    name:'search',
    initialState:{
        search:null
    },

    reducers:{
        setSearch(state,action){
            state.search=action.payload
        }
    }

})

export const {setSearch}=SearchSlic.actions
export default SearchSlic.reducer