import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../confiq/Axio";
import { FaCartShopping } from "react-icons/fa6";
import { AiFillThunderbolt } from "react-icons/ai";
import ProductCard from '../component/ProductCard';
import { showLoading,hideLoading } from "../Redux/LoadingSlic";
import {useDispatch,useSelector} from 'react-redux'
import { FaStar } from "react-icons/fa6";

// import {toast as ho} from "react-hot-toast";
import Review from "../component/Review";
import {toast  } from 'react-toastify'
import Layout from "../component/Layout";


const Productpage = () => {
  const { id } = useParams();
  const navigate=useNavigate()
  const isauthenticate=useSelector((state)=>state.auth.isAuthenticate)
  const dispatch=useDispatch()
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(4);
  const[similarProduct,setSimiliarProduct]=useState([])
  const [reviews,setReviews]=useState([])
  const [review,setReview]=useState({
    total:null,
    average:null
  })

  // console.log("product,",product)
 

  useEffect(() => {
    getproduct();
  }, [id]);

  useEffect(() => {
  if (product?.category?._id) {
    getSimiliarProduct();
     getReviews()  
  }
}, [product?.category?._id]);

  const getproduct = async () => {
    try {
      
    //   setLoading(true);
    dispatch(showLoading())
      const response = await axiosInstance.get(`/getproduct/${id}`);
      setProduct(response?.data?.product);
      setSelectedImage(response?.data?.images?.[0] || "");
      setLoading(false);
    } catch (error) {
      console.log("error in get product", error);
    //   setLoading(false);
    }finally{
        console.log('finally block')
        dispatch(hideLoading())
    }
  };
  const getSimiliarProduct=async(req,res)=>{
    try {
        setLoading(true)
        const response=await axiosInstance.get(`/SimilarProduct/${product?.category?._id}/${id}`)
        console.log(response)
        setSimiliarProduct(response?.data?.products)
    } catch (error) {
        console.log("similoar product error=",error)
    }finally{
        setLoading(false)
    }

  }

  const getReviews=async()=>{
    console.log("handle review in get reviews")
    try {
      const response =await axiosInstance.get(`/review/${id}`)
      console.log("review response",response)
      setReviews(response?.data?.reviews) 
      let rev=response?.data?.reviews 
      
      handleReview(rev) 
    } catch (error) {
      console.log("error in getting reviews",error)
    }
  }
      

 const  Addtocart=async(productId)=>{
    console.log("add to cart",isauthenticate)
       if(!isauthenticate){
        
        navigate('/login')
       }
       console.log("product id=",productId)
       
       try {
        const response=await axiosInstance.post('/user/addToCart',{productId})
        toast.success(response?.data?.message)
       } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message)
       }
 }

const handleReview=(rev)=>{
  console.log("inside handle review",rev)
  
  if(rev.length > 0){
    let avg=0
    for (let index = 0; index < rev.length; index++) {
      avg=avg+rev[index].rating
      
      
    }
    console.log(avg)
    avg=avg / rev.length
    console.log("avg",avg,"total",rev.length)
    setReview({average:avg,total:rev.length})

  }else{
    console.log("handle review else")

  }

}

//   if (loading) {
//     return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
//   } 

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }
  const handleBuynow=(id)=>{
    console.log('inside handle buy now')
    if(!isauthenticate){
      toast.warn('please Login ')
      navigate('/login')
      
    }else{
      
      navigate(`/direct_checkout/${id}`)
    }
  }

  return (
    <div className="min-h-screen w-full ">
      <Layout>

      
    <div className="min-h-screen w-full py-8 px-4 sm:px-8 lg:px-8 mx-auto">
      {/* Main Product Section */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        {/* Left Section - Image Gallery */}
        <div className="w-full lg:w-2/5 lg:sticky lg:top-10 h-fit">
          <div className="flex flex-col lg:flex-row gap-4  ">   
            {/* Thumbnail Column */}
            {/* <div className="flex flex-row sm:flex-col gap-2 sm:order-first order-last ">      */}
             <div className="flex md:flex-col gap-2 order-last md:order-first   pb-2 ">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(image)}   
                  className={`flex-shrink-0 w-10 h-10 lg:w-20 lg:h-20 border rounded cursor-pointer overflow-hidden transition ${
                    selectedImage === image ? "border-2 border-blue-500" : "border-gray-200 hover:border-gray-300"
                  }`}     
                >
                  <img
                    src={image}
                    alt={`${product.name} thumbnail ${index}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            
            {/* Main Image */}
            <div className=" max-w-96 aspect-square border border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
              <img
                src={selectedImage || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover p-4"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button 
              type="button" 
               onClick={()=>Addtocart(product._id)}
              className="flex-1 flex justify-center items-center gap-2 px-6 py-3 rounded-md bg-[#ABBB19] text-white font-medium hover:bg-[#9aaa10] transition shadow-md hover:shadow-lg"
            >
              <FaCartShopping className="text-lg"/> ADD TO CART
            </button>
            <button
              onClick={()=>handleBuynow(product._id)}
              className="flex-1 flex justify-center items-center gap-2 px-6 py-3 rounded-md bg-[#ABBB19] text-white font-medium hover:bg-[#9aaa10] transition shadow-md hover:shadow-lg"
            >
              <AiFillThunderbolt className="text-lg"/> BUY NOW
            </button>
          </div>
        </div>

        {/* Right Section - Product Details */}
        <div className="w-full lg:w-3/5 flex flex-col gap-5">
          {/* Product Info Card */}
          <div className="w-full p-6 border border-gray-200 rounded-lg shadow-sm">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              {product?.name}
            </h1>
            
            <div className="text-sm text-gray-500 mb-4">
              {product?.category?.category || "General"}
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold text-gray-900">
                {product?.discountprice}
              </span>
              {product?.discount > 0 && (
                <>
                  <span className="text-lg line-through text-gray-500">
                    {product?.price}
                  </span>
                  <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
                    {product?.discount}% OFF
                  </span>
                </>
              )}
            </div>
            {
              reviews && reviews.length >0 &&(
                <>
                 <div className="flex items-center gap-2 mb-6">
              <div className="flex justify-center px-2 gap-2 items-center bg-green-500 py-1 rounded-md text-white">
                <span><FaStar size={14}/></span>
                <span className="text-sm">{review.average.toFixed(1)}</span>
                
              </div>
              <span className="text-gray-500 text-sm">({review.total} reviews)</span>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 text-gray-800">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {product?.description}
              </p>
            </div>
            </>

              )
            }
            
           
          </div>

          {/* Product Details Card */}
          <div className="w-full p-6 border border-gray-200 rounded-lg shadow-sm">
            <h2 className="font-medium text-2xl mb-4">Product Details</h2>
            <hr className="my-3 border-gray-200" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-2">
                <h3 className="font-medium text-gray-600">Name:</h3>
                <p>{product?.name}</p>
              </div>
              
              <div className="flex gap-2">
                <h3 className="font-medium text-gray-600">Category:</h3>
                <p>{product?.category?.category}</p>
              </div>
              
              <div className="flex gap-2">
                <h3 className="font-medium text-gray-600">Stock:</h3>
                <p className={product?.stock > 0 ? "text-green-600" : "text-red-600"}>
                  {product?.stock > 0 ? `${product.stock} available` : "Out of stock"}
                </p>
              </div>
              
              {product?.core_details && Object.entries(product.core_details).map(([key, value]) => (
                <div className="flex gap-2" key={key}>
                  <h3 className="font-medium text-gray-600 capitalize">{key}:</h3>
                  <p>{value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full p-4  border border-gray-200 rounded-lg shadow-sm">
           {
            reviews?.length >0 ?(
               <Review reviews={reviews} />
            ):(
              <div className="h-20 my-2">
                <h1 className="font-medium text-2xl ">Reviews</h1>
                <p className="text-center text-gray-400">there is no review added</p>

              </div>
            )
           }
            

          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      <div className="w-full mt-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-medium text-2xl">Similar Products</h1>
          {
            similarProduct.length > 4 && (
                 <button 
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            onClick={() => setVisible(visible === 4 ? similarProduct.length : 4)}
          >
            {visible === 4 ? "VIEW ALL" : "VIEW LESS"}
          </button>

            )
          }
         
        </div>
        {
            loading?(
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-lg h-80 animate-pulse"></div>
              ))}
            </div>  
            ):(
                
            
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {similarProduct.slice(0, visible).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
            )
        }
        
        
      </div>
    </div>
    </Layout>

    </div>
  );
};

export default Productpage;