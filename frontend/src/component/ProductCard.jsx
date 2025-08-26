import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { MdOutlineStar } from "react-icons/md";
import { showLoading,hideLoading } from '../Redux/LoadingSlic';
import { useDispatch,useSelector } from 'react-redux';
import {AddToWishlist,RemoveToWishlist} from "../Redux/AuthSlic"
// import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";


import {toast} from 'react-hot-toast'
import axiosInstance from '../confiq/Axio';


const ProductCard = ({ product }) => {
  const Wishlist=useSelector((state)=>state.auth.wishlist)
  
  //  console.log("average rating=",product.averageRating)  
     
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isHover,setIsHover]=useState(false)
  const [loading,setLoading]=useState(false)


  const handleAddToCart = async(id) => {
    // setIsAddedToCart(true);
    // setTimeout(() => setIsAddedToCart(false), 2000); // Reset after 2 seconds
    // console.log('Added to cart:', product.name);
    try {
      dispatch(showLoading())
      const response=await axiosInstance.post('/user/addToCart',{productId:id})
      console.log(response)
      toast.success(response?.data?.message)
      setIsAddedToCart(true)
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
    }finally{
      dispatch(hideLoading())
    }
  };

  const handleWishlist=async(id,val)=>{
    
    try {
      dispatch(showLoading())
      if(!val){
          const response=await axiosInstance.post(`/user/addtowishlist/${id}`)
      
      console.log(response)
      dispatch(AddToWishlist(id))
      toast.success(response?.data?.message)
      }else{
        const response=await axiosInstance.delete(`/user/deleteItemsInWishlist/${id}`)
         console.log(response)
      dispatch(RemoveToWishlist(id))
      toast.success(response?.data?.message)

      }
      
    } catch (error) {
      console.log(error)
    }finally{
      dispatch(hideLoading())
    }

  }

  return (
    <div className="bg-white/65 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
      {/* Wishlist Button (Top Right) */}
      

      {/* Product Image */}
      <Link to={`/product/${product?._id}`} className="block">
        <div
        onMouseEnter={()=>setIsHover(true)}  
        onMouseLeave={()=>setIsHover(false)}
         className="relative aspect-square">
          <img
            src={isHover ? product?.images[1] :product?.images[0] || '/placeholder-product.jpg'}
            alt={product?.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {product?.discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {product?.discount}% OFF
            </span>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <div className='flex items-center justify-between'>

       
        <Link to={`/product/${product?._id}`}>
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        </Link>
        <button onClick={()=>{
          Wishlist.includes(product?._id) ?   handleWishlist(product?._id,true):

          handleWishlist(product?._id,false)}}>{
             Wishlist.includes(product?._id) ?
             <FaHeart className={`w-5 h-5  text-red-500`}/>:
              <FiHeart className={`w-5 h-5  `}/>


          }
         
         
        </button>
         </div>
         {
        //  averageRating
          product.averageRating &&(
              <div className="flex items-center  bg-green-500 text-white px-2 py-0.5 rounded-md space-x-1 w-fit">
  <span className="text-xs font-medium">{product.averageRating.toFixed(1) || "N/A"}</span>
  <MdOutlineStar className="text-sm" />
</div>
          )
         }
      


        {/* Price */}
        <div className="mb-3">
          {product.discount > 0 ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="font-bold text-gray-900">₹{product.discountprice?.toFixed(2)}</span>
              <span className="text-sm text-gray-500 line-through">${product.price?.toFixed(2)}</span>
            </div>
          ) : (
            <span className="font-bold text-gray-900">₹{product.price?.toFixed(2)}</span>
          )}   
        </div>

        {/* Add to Cart Button */}
        <button     
          onClick={()=>{
            handleAddToCart(product?._id)}}
          // disabled={isAddedToCart}
          className={`w-full text-sm py-1 px-1 sm:px-0 sm:py-2 rounded-md flex items-center justify-center gap-2 sm:gap-2 transition-colors ${
            isAddedToCart
              ? 'bg-green-500 text-white'
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
         
           
              <FiShoppingCart className="  w-4 h-4" />
              Add
         
        </button>
      </div>
    </div>
  );
};

export default ProductCard;