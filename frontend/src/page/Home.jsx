import Layout from "../component/Layout";
import HeroBanner from "../component/HeroBanner";
import { useEffect, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import axiosInstance from "../confiq/Axio";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {toast} from 'react-hot-toast'
import { MdOutlineStar } from "react-icons/md";
import { showLoading,hideLoading } from "../Redux/LoadingSlic";


const HomePage = () => {
  const dispatch=useDispatch()
  const isauthenticate=useSelector((state)=>state.auth.isAuthenticate)
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);
  const [featuredProducts, setFeaturedPrdoucts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [visibleCategories, setVisibleCategories] = useState(5); // Initial count
  const initialVisibleCount = 5;
  const [wishlist,setWishlist]=useState([])
  const [loading,setLoading]=useState(false)   
  console.log("wishlist=",wishlist)
  // Sample data - replace with your actual data
  const categories = {
    food: "/category/food.jpg",
    pets: "/category/pets.jpg",  
    health: "/category/health.jpg",
    toys: "/category/toys.jpg",
    "groom-supplies": "/category/gromm.jpg",  
    "beds-furnitures": "/category/pet_furniture.webp",
    // Collars&leashes: "/category/collars.jpg",
    cloths:"/category/pet_clots.avif"
  };
   
  const normalize = (str) => str.trim().toLowerCase();

  useEffect(() => {
    fetchHomeData();
  }, []);

  const products = async () => {
    try {
      setLoading(true)
      const [featured, bestseller] = await Promise.all([
        axiosInstance.get(`/featuredproducts/${6}`),
        axiosInstance.get(`/bestselerproducts/${8}`),
      ]);
      console.log(featured);
      console.log(bestseller);
       setFeaturedPrdoucts(featured.data.products);
       setBestSellers(bestseller.data.products);  
    } catch (error) {
      console.log(error);
    }finally{
       setLoading(false)
    }
  };

  const fetchHomeData = async () => {
    try {
      dispatch(showLoading())
      const response = await axiosInstance.get("/categories");

      console.log(response);
      setCategory(response.data.category);
      products();
      // setBestSellers(bestRes.data.bestseller) 
      // setFeaturedPrdoucts(featRes.data.featuredproduct)
    } catch (error) {
      console.log("get home data", error);
    }finally{
      dispatch(hideLoading())
    }
  };
  console.log("category=", category);
  const addwhishlist=async(id,e)=>{
      e.stopPropagation(); // prevent bubbling up to parent onClick
    if(!isauthenticate){
     navigate('/login')
     return null
    }

    try {
      const response=await axiosInstance.post(`/user/addtowishlist/${id}`)
      toast.success(response?.data?.message)
      setWishlist([...wishlist,id])

    } catch (error) {
      console.log(error)
    }

  }

  const addToCart=async(id,e)=>{
    e.stopPropagation()
    try {
      const response=await axiosInstance.post('/user/addToCart',{productId:id})
      console.log(response)
      toast.success(response?.data?.message)
    } catch (error) {
      console.log(error)
      
    }

  }

  return (
    <div className="flex flex-col overflow-x-hidden min-h-screen">
      <Layout>
        <main className="flex-grow">
          {/* Hero Banner Section */}
          <HeroBanner />

          {/* Popular Categories - Modern Design */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-14">
                <h2 className="text-4xl font-bold mb-3 text-gray-900">
                  Shop by Category
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Discover products in our most loved categories
                </p>
              </div>

              {/* Categories Grid */}
              {category.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
                  {category.slice(0, visibleCategories).map((category) => {
                    console.log("category=",category.category)
                    const imageKey = normalize(category.category);
                    console.log("image key=",imageKey)
                    const imageSrc = categories[imageKey] || "/banner.jpg";
                    console.log("src=",imageSrc)
                    return (
                      <div
                        key={category._id}
                        className="relative group overflow-hidden rounded-xl cursor-pointer"
                        onClick={() =>
                          navigate(`/category_product/${category._id}`)
                        }
                      >
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>

                        {/* Category Image */}
                        <img
                          src={imageSrc}
                          alt={category?.category}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />

                        {/* Category Info */}
                        <div className="absolute bottom-0 left-0 z-20 p-5 w-full">
                          <h3 className="text-xl font-semibold text-white mb-1">
                            {category.category}
                          </h3>
                          <p className="text-sm text-white/80">
                            {category.items}+ products
                          </p>
                        </div>

                        {/* Hover Indicator */}
                        <div className="absolute bottom-5 left-5 h-0.5 bg-white w-0 group-hover:w-10 transition-all duration-300 z-20"></div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="w-full flex flex-col justify-center text-red-500 items-center text-center space-y-2">
                  <p>Categories not found</p>
                  <p>or</p>
                  <p>Poor network connection. Please try reloading.</p>
                </div>
              )}

              {/* View More Button */}
              {category.length > initialVisibleCount && (
                <div className="mt-12 text-center">
                  <button
                    onClick={() =>
                      category.length === visibleCategories
                        ? setVisibleCategories(initialVisibleCount)
                        : setVisibleCategories(category.length)
                    }
                    className="inline-flex items-center justify-center bg-gray-400 rounded text-white py-1   px-2  hover:shadow-xl transition-colors"
                  >
                    {category.length === visibleCategories ? (
                      <span className="font-medium">Close categories</span>
                    ) : (
                      <span className="font-medium">
                        View all {category.length} categories
                      </span>
                    )}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Featured Products Section */}
          <section className="py-12 md:py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Featured Products
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Carefully selected products just for you
                </p>
              </div>

              
                {loading ? (
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {
                  [...Array(6)].map((_, index) => (
                    
                    <div className="animate-pulse bg-white shadow rounded p-4 w-full max-w-sm">
                      <div className="h-48 bg-gray-300 rounded mb-4"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                      <div className="flex space-x-2">
                        <div className="h-8 w-20 bg-gray-300 rounded"></div>
                        <div className="h-8 w-20 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  ))
                }
                </div>
                ) : featuredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {
                  featuredProducts.map((product) => (
                    <div
                      onClick={() => navigate(`/product/${product._id}`)}
                      key={product.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
                    >
                      <div className="relative">
                        <img
                          src={product.images[0] || "/banner.jpg"}
                          alt={product.name}
                          className="w-full h-64 object-cover"
                        />
                        {/* <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold flex items-center">
                        ⭐ {product.rating}
                      </div> */}
                      </div>
                      <div className="p-4">
                        <div className="w-full flex items-center justify-between">
                          <h3 className="font-semibold text-lg mb-2">
                            {product.name}
                          </h3>
                          <button
                            type="button"
                            onClick={(e) => addwhishlist(product._id, e)}
                          >
                            <FaRegHeart
                              className={`${
                                wishlist.includes(product._id)
                                  ? "text-red-500"
                                  : "text-gray-700"
                              }`}
                              size={20}
                            />
                          </button>
                        </div>

                        <div className="flex mt-1 justify-between items-center">
                          <span className="text-xl font-bold">
                            ${product.discountprice.toFixed(2)}
                          </span>
                          <button
                            onClick={(e) => addToCart(product._id, e)}
                            className=" bg-[#ABBB19] text-white px-4 py-2 rounded-md hover:bg-[#9aaa10] transition duration-300"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                }
                </div>
                ) : (
                  <div className="flex flex-col justify-center items-center text-center space-y-2">
                    <p>feature products not found</p>
                  </div>
                )}
              
            </div>
          </section>

          {/* Best Selling Products Section */}
          <section className="py-12 md:py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Best Sellers
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our most popular products loved by customers
                </p>
              </div>

              
                {loading ? (
                  <div className="grid  grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
                    {(

                    
                  [...Array(8)].map((_, index) => (
                     
                    <div className="animate-pulse bg-white shadow rounded p-4 w-full max-w-sm">
                      <div className="h-48 bg-gray-300 rounded mb-4"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                      <div className="flex space-x-2">
                        <div className="h-8 w-full bg-gray-300 rounded"></div>
                      </div>
                    </div>
                    
                  ))
                  )

                    }
                  </div>
                ) : bestSellers.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
                  {

                 

                  
                  bestSellers.map((product) => (
                    <div
                      onClick={() => navigate(`/product/${product._id}`)}
                      key={product.id}
                      className="border box border-gray-100 rounded-xl overflow-hidden shadow-md transition-all relative group"
                    >
                      {/* Discount Badge */}
                      {product.discount > 0 ||
                        (true && (
                          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                            {product.discount || "5"}% OFF
                          </span>
                        ))}

                      {/* Wishlist Heart */}
                      <button
                        className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 z-10 hover:bg-red-100 transition-all"
                        onClick={(e) => addwhishlist(product._id, e)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          // className={`h-5 w-5 text-gray-400`}
                          className={`h-5 w-5 ${
                            wishlist.includes(product._id)
                              ? "text-red-500 fill-red-500"
                              : "text-gray-400"
                          }`}
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>

                      {/* Product Image */}
                      <div className="relative pb-[100%]">
                        <img
                          src={product.images[0] || "/banner.jpg"}
                          alt={product.name}
                          className="absolute h-full w-full object-cover group-hover:opacity-90 transition-opacity"
                        />
                        {/* Items Sold */}
                        <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-full">
                          🔥 {product.sold} sold
                        </span>
                      </div>

                      {/* Product Info */}
                      <div className="p-2">
                        <h3 className="font-medium text-lg mb-1 line-clamp-2 ">
                          {product.name}
                        </h3>
                        {product.averateRating && (
                          <div className="flex items-center  bg-green-500 text-white px-2 py-0.5 rounded-md space-x-1 w-fit">
                            <span className="text-xs font-medium">
                              {product.averateRating.toFixed(1) || "N/A"}
                            </span>
                            <MdOutlineStar className="text-sm" />
                          </div>
                        )}

                        {/* Price Section */}
                        <div className="flex items-center gap-2 mt-2">
                          {product.discount > 0 ? (
                            <>
                              <span className="font-bold text-gray-900">
                                ${product.discountprice}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                ${product.price.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="font-bold text-gray-900">
                              ${product.price.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          className="mt-4 w-full  py-2 bg-black text-white rounded-lg text-sm  hover:bg-gray-800 transition flex items-center justify-center gap-1 sm:gap-2"
                          onClick={(e) => addToCart(product._id, e)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                   
</div> ) : (
                  <div className="flex flex-col text-gray-400 justify-center items-center space-y-2">
                    <p>Best seller product not found</p>
                  </div>
                )}
              
            </div>
          </section>

          {/* Newsletter Section (Bonus) */}
          {/* <section className="py-12 md:py-16 bg-blue-600 text-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Stay Updated
              </h2>
              <p className="mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter for the latest products and deals
              </p>
              <div className="max-w-md mx-auto flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-4 py-3 rounded-l-lg focus:outline-none text-gray-800"
                />
                <button className="bg-blue-800 px-6 py-3 rounded-r-lg font-bold hover:bg-blue-900 transition duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </section> */}
        </main>
      </Layout>
    </div>
  );
};

export default HomePage;
