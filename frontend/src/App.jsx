import React from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "./page/Home";
import ProductByCategory from "./page/ProductByCategory";
import Productpage from "./page/Productpage";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "./component/Spinner";
import CartPage from "./page/Cart";
import Login from "./page/Login";
import { Toaster } from "react-hot-toast";
import SignUp from "./page/SignUp";
import { useEffect } from "react";
import axiosInstance from "./confiq/Axio";
import {setLogin,setWishlist} from './Redux/AuthSlic'
import TokenExpired from "./page/TokenExpired";
import Wishlist from "./page/Wishlist";
import Checkoutpage from "./page/Checkoutpage";
import SuccessPayment from "./page/SuccessPayment";
import Searchbyproducts from "./page/Searchbyproducts";
import Order from "./page/Order";
import Check_Out from "./page/check_Out";
import Account from "./page/Account";
import {ToastContainer} from 'react-toastify'
import ScrollToTop from "./component/ScrollTop";
import Forgetpass from "./page/Forgetpas";

const App = () => {
  const loading = useSelector((state) => state.loading.isLoading);
  const dispatch=useDispatch()
  const isAuthenticate = useSelector((state) => state.auth.isAuthenticate);
  const navigate=useNavigate()
  console.log("isauthentication=",isAuthenticate)
  useEffect(()=>{
     if(!isAuthenticate){
       checkauth()
     }
  },[isAuthenticate])
  const checkauth=async()=>{
    try {
      const response=await axiosInstance.get('/auth/checkauth')
      console.log("check auth=",response)
      dispatch(setLogin())
      console.log("whislist items=",response?.data?.wishlist)
      dispatch(setWishlist(response?.data?.wishlist))

    } catch (error) {
      console.log("check auth=",error)
      // navigate('/token-expired')
    }  
  }

  return (
    <div className="min-h-screen w-full relative">
      {/* Show spinner overlay if loading */}
      {loading && (
        <div className="min-h-screen w-full">
          <Spinner />
        </div>
      )}
      <Toaster />
      <ToastContainer  position='top-center'/>
      <ScrollToTop/>

      {/* App Routes */}
      <Routes>
        <Route path="/token-expired" element={<TokenExpired/>} />
        
       
        <Route path="/login" element={!isAuthenticate ? <Login /> : <Navigate to='/'/>} />
        <Route path="/signup" element={!isAuthenticate ? <SignUp /> : <Navigate to='/'/>} />
        <Route path="/forgetpasssword" element={<Forgetpass/>}/>
        

        
        <Route path="/" element={<HomePage />} />
        <Route path="/category_product/:id" element={<ProductByCategory />} />
        <Route path="/product/:id" element={<Productpage />} />
        <Route path="/searchproducts" element={<Searchbyproducts/>} />
         <Route path="/cart" element={isAuthenticate ?<CartPage /> : <Navigate to='/login'/> } />
        <Route path="/wishlist" element={isAuthenticate ?<Wishlist/> :<Navigate to='/login'/>} />
        <Route path="/checkout" element={isAuthenticate ? <Checkoutpage/> : <Navigate to='/login'/>} />
        <Route path="/payment-success" element={<SuccessPayment/>} />
        <Route path="/orders" element={<Order/>} />
        <Route path="/direct_checkout/:id"  element={<Check_Out/>}  />
        <Route path='/account' element={<Account/>}/>
      </Routes>
    </div>
  );
};

export default App;
