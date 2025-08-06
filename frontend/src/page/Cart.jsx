import React, { useState } from "react";
import { useEffect } from "react";
import { FaTrash, FaPlus, FaMinus, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../Redux/LoadingSlic";
import axiosInstance from "../confiq/Axio.js";
import { useNavigate } from "react-router-dom";
import {setCart} from '../Redux/CartSlic.js'
import {toast} from "react-hot-toast";
import Layout from '../component/Layout.jsx'

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate=useNavigate()
  // Dummy cart data

  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    getcarts();
  }, []);
  const[loading,setLoading]=useState(null)

  const getcarts = async () => {
    try {
      dispatch(showLoading());
      const response = await axiosInstance.get("/user/getCarts");
      let data = response?.data?.carts || [];
      console.log("data=", data);
      setCartItems(data);
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoading());
    }
  };
  console.log("cart items", cartItems);

  // Calculate totals based on cart items
  const subtotal = cartItems?.items?.reduce(
    (sum, item) => sum + item?.product?.discountprice * item.quantity,
    0
  );
  const shipping = subtotal < 1000 ? 50 : 0;   
  console.log("Shipping=", shipping);
  const total = subtotal + shipping;

  const updateQuantity = async(index,productId, newQuantity) => {
    if (newQuantity < 1) return;

     try {
      setLoading(productId)
      const response=await axiosInstance.put(`/user/updateCartquantity/${productId}/${newQuantity}`)
      console.log(response)
      console.log(newQuantity,index,productId)
      const updateItems=cartItems.items.map((val)=>{
        // console.log(val)
        // val._id === productId ?{...val,quantity:newQuantity} :val
        console.log(val._id,"=",productId)
        if(val.product._id == productId){
          console.log("inside the quantitychange=",newQuantity)
          return(
            {...val,quantity:newQuantity}
          )

        }else{
          return(
            val
          )
        }
     })
      console.log("updated cart items=",updateItems)
      setCartItems({...cartItems,items:updateItems})
     

      
     } catch (error) {
      console.log(error)
     }finally{
      setLoading(null)
     }

    
  };

  const removeItem = async(productId) => {
    try {
      console.log(cartItems.items)
      // return null
      dispatch(showLoading())
      const response=await axiosInstance.delete(`/user/delete/cartitem/${productId}`)
       
      console.log("cart remove",response)
      toast.success(response?.data?.message) 
      console.log("product id=",productId)

      setCartItems({
  ...cartItems,
  items: cartItems.items.filter((item) => item.product._id !== productId),
});

       console.log("cart items=",cartItems)

    } catch (error) {
      console.log("carterror =",error)
      toast.error(error?.response?.data?.message)
    }finally{
      dispatch(hideLoading())
    }

   
  };

  const clearCart = () => {
    setCartItems([]);
    
  };

  // if (cartItems?.items?.length === 0) {
  //   return (
     
  //   );
  // }

  const proceedtocheckout=()=>{
    console.log(cartItems)
    const newobj=cartItems.items.filter((val)=>{
      if(val.quantity<=val.product.stock){
        return val
      }
    })
    console.log("cacat",newobj)
    dispatch(setCart(newobj,subtotal))
   
    console.log(newobj)
    // return null
     navigate('/checkout')
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden"
    >
        <Layout>
          
          
    <div className="h-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    
      {
        cartItems?.length===0?(
                 
        <div className="flex sm:pt-20 gap-2 justify-center items-center">

          <p className="text-gray-400  sm:text-xl">youre cart is empty</p>
          

        <Link 
          to="/"
          className=" flex border justify-center items-center gap-2 bg-green-500 opacity-80 text-white rounded sm:px-1"
        >
           Continue Shopping   <FaArrowRight />
        </Link>
        </div>
     
        ):(
          <>
          <h1 className="text-3xl font-bold mb-8">
        Your Shopping Cart ({cartItems?.items?.length})
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="lg:w-2/3">
          {cartItems?.items?.map((item,index) => {
            const product = item.product;

            return (
              <div
                key={item._id}
                className="p-4 border-b last:border-b-0 hover:bg-gray-50 transition"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Product Info */}
                  <div className="md:col-span-5 flex items-center gap-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-20 h-20 object-contain"
                    />
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-500">
                        Stock: {product.stock}
                      </p>
                      {product.discount > 0 && (
                        <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="md:col-span-2 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-medium">
                        ${product.discountprice}
                      </span>
                      {product.discount > 0 && (
                        <span className="text-xs line-through text-gray-400">
                          ${product.price}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="md:col-span-3 flex justify-center">
  <div className={`flex items-center border ${loading === product._id ?' opacity-55' :''}  rounded-md`}>
    {/* Minus Button */}
    <button
      onClick={() => updateQuantity(index, product._id, item.quantity - 1)}
      className={`px-3 py-1 text-gray-600 transition ${
        loading === product._id
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-gray-100"
      }`}
      disabled={item.quantity <= 1 || loading === product._id}
    >
      <FaMinus size={12} />
    </button>

    {/* Quantity Display */}
    <span className="px-3 py-1 border-x w-10 text-center">
      {item.quantity}
    </span>

    {/* Plus Button */}
    <button
      onClick={() => updateQuantity(index, product._id, item.quantity + 1)}
      className={`px-3 py-1 text-gray-600 transition ${
        loading === product._id
          ? "opacity-50  cursor-not-allowed"
          : "hover:bg-gray-100"
      }`}
      disabled={item.quantity >= product.stock || loading === product._id}
    >
      <FaPlus size={12} />
    </button>
  </div>
</div>


                  {/* Total and Remove */}
                  <div className="md:col-span-2 flex items-center justify-end gap-4">
                    <div className="font-medium">
                      ${(product.discountprice * item.quantity).toFixed(2)}
                    </div>
                    <button
                      onClick={() => removeItem(product._id)}
                      className="text-red-500 hover:text-red-700 transition"
                      aria-label="Remove item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">

             <button
             onClick={()=>navigate(-1)}
              className="px-6 py-2 border rounded-md hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <FaArrowLeft /> Continue Shopping
           </button>
            <div className="flex gap-4">
              <button
                className="px-6 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>
          
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>
                  Subtotal (
                  {cartItems?.items?.reduce(
                    (acc, item) => acc + item.quantity,
                    0
                  )}{" "}
                  items)
                </span>
                <span>${subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {/* {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`} */}
                  {shipping}
                </span>
              </div>
              {subtotal < 100 && (
                <div className="text-sm text-green-600">
                  Spend ${(100 - subtotal).toFixed(2)} more for free shipping!
                </div>
              )}
              <div className="flex justify-between border-t pt-3 font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={proceedtocheckout} className="w-full py-3 bg-[#ABBB19] text-white rounded-md hover:bg-[#9aaa10] transition font-medium">
              Proceed to Checkout
            </button>

            <div className="mt-4 text-sm text-gray-500">
              *Taxes will be calculated during checkout
            </div>
          </div>
        </div>
      </div>
          </>
        )
      }
     
    </div>
 </Layout>
    </div>
  );
};

export default CartPage;
