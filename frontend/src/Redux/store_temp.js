import LoadSlic from './LoadingSlic'
import authSlic from './AuthSlic'
import CartSlic from './CartSlic'
import SearchSlic from './SearchSlic'
// import authSlic from './authSlic'
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: {
     auth: authSlic,
    loading:LoadSlic,
    cart:CartSlic ,
    search:SearchSlic ,

  
   
  },
});
export default store

