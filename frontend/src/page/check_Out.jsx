import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { TiMinus } from "react-icons/ti";
import { useParams } from "react-router-dom";
import axiosInstance from "../confiq/Axio";
import { useDispatch } from "react-redux";
import { showLoading,hideLoading } from "../Redux/LoadingSlic";
import Layout from "../component/Layout";


const check_Out = () => {
    const {id}=useParams()
    const dispatch=useDispatch()
  // State for user data
  const [address, setAddress] = useState({
    street: "",
    city: "",
    district: "",
    state: "",
    country: "",
    pin: "",
  });
  const [mobile, setMobile] = useState(null);
  const [product,setProduct]=useState({})
  const [data,setData]=useState({
    price:'',
    totalPrice:'',
    quantity:1,
    id:'',
    name:'',
    sellerId:''
  })
  const [isloading,setIsloading]=useState(false)


 

  // State for UI
  // const [isLoading, setIsLoading] = useState(true);
  const [showMobileForm, setShowMobileForm] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [editAddress,setEditAddress]=useState()
  const [editMobile,setEditMobile]=useState()
  const [loading,setLoading]=useState(false)
  const [fieldLoading,setFieldLoading]=useState({
    mobile:false,
    address:false
  })

 



const shipping = useMemo(() => {
  return data.totalPrice > 1000 ? 0 : 50;  // free shipping if subtotal > ₹1000
}, [data.totalPrice]);

const total = useMemo(() => {
  return data.totalPrice + shipping;
}, [data.totalPrice, shipping]);


  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
         dispatch(showLoading())
         const response=await axiosInstance.get(`/user/details/product&address/${id}`)
         let res=response?.data
         console.log(response)
         setProduct(response.data.product)  
         setData({...data, name:response?.data?.product?.name ,isAdmin:response?.data?.product.isAdmin,price:response?.data?.product.discountprice,id:response?.data?.product?._id,
          totalPrice:response?.data?.product?.discountprice,sellerId:response?.data?.product?.addedBY})
         setMobile(res.user.phone)
         setAddress({
          street:res.address.street,city:res.address.city,district:res.address.district,state:res.address.state,
          country:res.address.country,pin:res.address.pin
         }) 
         setEditMobile(res.user.phone)
         setEditAddress(res.address)
      } catch (error) {
        console.error("Error fetching user data:", error);
       

      }finally{
        console.log('finally')
               dispatch(hideLoading())
      }
    };
   

    fetchUserData();
  }, []);
 


  // Handle address input changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress({
      ...address,
      [name]: value,
    });
  };
  // Save mobile number
  const saveMobileNumber = async() => {
    // In a real app, you would send this to your backend
    if(!mobile.trim()){
      toast.error('phone number is required')
      return null
    }
    const phonePattern = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;

    if (mobile.length > 10) {
      toast.error("invalid mobile format");
      return null;
    }
    if (!phonePattern.test(mobile)) {
      toast.error("invalid mobile format");
      return null;
    }
    
    if(mobile===editMobile){
      setShowMobileForm(false);
      return null
    }
    try {
      // setIsloading(true)
      setFieldLoading({...fieldLoading,mobile:true})
      const response=await axiosInstance.post('/user/updatemobile',{mobile})
      toast.success(response?.data?.message)
      console.log(response)
       setShowMobileForm(false);
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
    }finally{
       setFieldLoading({...fieldLoading,mobile:false})
    }
  };
   const handleQuantity=(newQuantity)=>{
   console.log("controls")     

   
    setData({...data,totalPrice:product?.discountprice * newQuantity,quantity:newQuantity})
  }

  // Save address  
  const advalidation=()=>{
    if(!address.street.trim()){
      toast.error('street is required')
      return false
    }
    if(!address.city.trim()){
      toast.callerror('city is required')
      return false
    }
     if(!address.district.trim()){
      toast.error('district is required')
      return false
    }
     if(!address.state.trim()){
      toast.error('state is required')
      return false
    }
     if(!address.country.trim()){
      toast.error('country is required')
      return false
    }
     if(!address.pin.trim()){
      toast.error('pin  is required')
      return false
    }
    return true
    
  }
  const saveAddress = async() => {
    if(advalidation()){
      
    
       let key=['street','city','district','state','country','pin']
       let check=false
       if(editAddress){
          check=key.some((val)=>{
        if(editAddress && editAddress[val]!== address[val]){
          return true
        }
       })
       }else{
        check=true
       }
       
       
       if(check){
        console.log("inside the save address")
         try {
          const response=await axiosInstance.post('/user/updateAddress',{address})
          console.log(response)
          toast.success(response?.data?.message)
           setShowAddressForm(false);

         } catch (error) {
          console.log(error)
          
         }
       }
      //  setShowAddressForm(false);
    }

   
   

  };



  // Handle checkout submission
  const handleCheckout = async() => {
   console.log("inside the check out",mobile?.length)
   if(!mobile){
    toast.error('mobile number is required')
    return null
   }
    if((mobile.length >10 || mobile.length<10 ) || !mobile.trim()){
      console.log("mobile")
      toast.error("please provide valid mobile")
      return null
    }
    if(!advalidation()){
      toast.error('please fill Delivery address')
      return null

    }
    console.log(mobile)
    console.log(address)
    let cart=[data]
    console.log(cart)
    //  return null;
     
     


    try {
      
      //  dispatch(showLoading())
      setLoading(true)
         const response=await axiosInstance.post('/user/payment',{
          cart,mobile,address,shipping,source:'direct'
         })
         console.log(response)
         window.location.href = response.data.url;
    } catch (error) {
      console.log(error)
    }finally{
      //  dispatch(hideLoading())
      setLoading(false)
    }

  };

  // 
  console.log("show mobile form", showMobileForm);

  return (
    <div className="flex flex-col ">
      <Layout>

   
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column - User info */}
        <div className="lg:w-2/3">
          {/* Mobile Number Section */}   
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Mobile Number</h2>

              <button
                onClick={() => setShowMobileForm(true)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {mobile ? "Edit" : "Add"}
              </button>
            </div>

            {mobile && !showMobileForm ? (
              <div className="flex items-center">
                <span className="text-gray-700">{mobile}</span>
              </div>
            ) : showMobileForm ? (
              <div className="space-y-4">
                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end space-x-2">
                  <button
                  disabled={fieldLoading.mobile}
                    onClick={() => setShowMobileForm(false)}
                    className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={fieldLoading.mobile}
                    onClick={saveMobileNumber}
                    className={`px-4  flex justify-center items-center py-2 ${fieldLoading.mobile? 'bg-gray-300 text-sm cursor-not-allowed':' hover:bg-blue-700 bg-blue-600' }  text-white rounded-md`}
                  >
                     {fieldLoading.mobile ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-3 w-3 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading...
                     
                    </>
                  ) : (
                    ' Save '
                  )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full">
                <p className="text-gray-400"> no number saved,please add </p>
              </div>
            )}
          </div>

          {/* Address Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Delivery Address</h2>
              <button
                onClick={() => setShowAddressForm(true)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {address?.street ? "Edit" : "Add Address"}
              </button>
            </div>

            {showAddressForm ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 ">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      street
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={address.street}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Street address"
                    />
                  </div>
                  
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      city/village
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      district
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={address.district}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={address.state}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                 
                </div>

                <div className="grid grid-cols-2 gap-4">
                   
                         <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="pin"
                      value={address.pin}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                       <div> 
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={address.country}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                   </div>
                   </div>
        

                <div className="flex justify-end space-x-2">
                  <button
                    disabled={fieldLoading.address}
                    onClick={() => setShowAddressForm(false)}
                    className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                  disabled={fieldLoading.address}
                    onClick={saveAddress}
                    className={`px-4 flex justify-center items-center py-2 ${fieldLoading.address ? 'bg-gray-300 text-sm cursor-not-allowed':'bg-blue-600  hover:bg-blue-700'}  text-white rounded-md`}
                  >
                    {fieldLoading.address ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-3 w-3 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading...
                     
                    </>
                  ) : (
                    ' Save '
                  )}
                  </button>
                </div>
              </div>
            ) : (
              // /Object.values(userData).join('') === false(
              <div className="space-y-4">
                {
                    Object.values(address).join('') ?(
                        <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{address.street}</p>
                    <p>
                      {address.city},{address.district}, {address.state} {address.pin}
                    </p>
                    <p>{address.country}</p>
                  </div>
                </div>
                    ):(
                      <p className="text-gray-500">
                  No addresses saved. Please add an address.
                </p>
                    )
                }
                

                
              </div>
            )}
          </div>
          <div className="bg-white py-3 px-4 shadow rounded-lg">
      <div className="flex gap-4 items-start">
        {/* Product Image */}
        <div className="flex flex-col items-center gap-2 w-20">
          <div className="w-full">
            <img 
              src={product?.images?.[0] || '/banner.jpg'} 
              alt={product?.name} 
              className="w-full h-14 object-cover rounded-md"
            />
          </div>
          
          {/* Quantity Controls */}
          <div className="flex items-center border my-2 border-gray-200 rounded-full">
            <button 
              className="py-1 px-2 text-gray-600 hover:bg-gray-50 rounded-l-full"
               onClick={() => handleQuantity(data.quantity-1)}
               disabled={data.quantity <= 1}
            >
              <TiMinus size={14} />
            </button>
            <span className="px-2 border border-gray-300 text-sm font-medium">{data?.quantity}</span>
            <button 
              className="py-1 px-2 text-gray-600 hover:bg-gray-50 rounded-r-full"
              onClick={() => handleQuantity(data.quantity+1)}
              disabled={data.quantity >= product?.stock}
            >
              <FaPlus size={12} />
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="font-medium text-gray-800">{product?.name || 'hello'}</h1>
              <p className="text-sm text-gray-500">{product?.category?.category ||'category'}</p>
              <p className="text-xs text-gray-400 mt-1">Stock: {product?.stock ||'23'}</p>
            </div>
            {/* <button 
              className="text-gray-400 hover:text-red-500"
              // onClick={onRemove}
            >
              <FaTrash size={14} />
            </button> */}
          </div>

          {/* Price Information */}
          <div className="flex items-center gap-3 mt-2">
            <p className="text-sm text-gray-400 line-through">₹{product?.price}</p>
            <h3 className="text-lg font-semibold text-gray-800">₹{data?.totalPrice}</h3>
            {1 > 0 && (
              <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                {product?.discount}% off
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
           
        </div>

        {/* Right column - Order summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-lg font-semibold mb-4"> Summary</h2>

            

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{data.totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{shipping}</span>
              </div>
             
              <div className="flex justify-between font-bold text-lg mt-2">
                <span>Total</span>
                <span>{total}</span>
              </div>
            </div>
            {
              console.log("selected address=",selectedAddress)
            }

            <button
            type="butt"
              onClick={handleCheckout}
               disabled={!address.street.trim() || !mobile}
              className={`w-full flex justify-center items-center mt-6 py-3  ${loading  ?'bg-gray-300 cursor-not-allowed ': !mobile ? 'bg-gray-300':'bg-blue-600 hover:bg-blue-700'} rounded-md font-medium  text-white
              `}
            >
              
              {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading...
                     
                    </>
                  ) : (
                    ' Proceed to payment '
                  )}
            </button>
          </div>
        </div>
      </div>
    </div>
    </Layout>
     </div>
  );
};

export default check_Out;
