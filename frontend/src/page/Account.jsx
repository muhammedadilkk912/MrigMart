import { useEffect, useState } from "react";
import Layout from '../component/Layout'
import Otp from "../component/Otp";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLock,
  FiCreditCard,
  FiHeart,
  FiEdit,
  FiLogOut,
} from "react-icons/fi";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../Redux/LoadingSlic";
import axiosInstance from "../confiq/Axio";
import { countries } from "countries-list";
import toast from "react-hot-toast";
const Account = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading,setLoading]=useState(false)  
  const [editMode, setEditMode] = useState(false);
  const [orginaldata, setOriginaldata] = useState({});
  const [address, setAddress] = useState({
    street: "",
    city: "",
    district: "",
    state: "",
    country: "",
    pin: "",
  });
  const dispatch = useDispatch();
  const countryNames = Object.values(countries).map((c) => c.name);
  // console.log("country name=",countryNames)
  // Sample user data
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",

    // password: '********'
  });
  const [otp,setOtp]=useState(false)

  useEffect(() => {
    getAccount();
  }, [activeTab]);

  const getAccount = async () => {
    try {
      setAddress({});
      dispatch(showLoading());
      const response = await axiosInstance.get(`/user/getaccount/${activeTab}`);
      let data = response?.data?.data;
      console.log("profile", response);

      setOriginaldata(response?.data?.data);
      if (activeTab === "profile")
        setUser({
          ...user,
          name: data.username,
          email: data.email,
          phone: data.phone,
        });
      if (activeTab === "address")
        setAddress({
          ...address,
          street: data.street,
          city: data.city,
          district: data.district,
          state: data.state,
          country: data.country,
          pin: data.pin,
        });
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(hideLoading());
    }
  };
  const handlechecking = () => {
    if (!address.street?.trim()) {
      toast.error("street is required");
      return false;
    }
    if (!address.city?.trim()) {
      toast.error("city  is required");
      return false;
    } else if (!address?.district?.trim()) {
      toast.error("district is required");
      return false;
    } else if (!address.state?.trim()) {
      toast.error("state is required");
      return false;
    } else if (!address.country?.trim()) {
      toast.error("country is required");
      return false;
    } else if (!address?.pin?.trim()) {
      console.log("pin=", address?.pin);
      toast.error("pin is required");
      return false;
    }
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (activeTab === "address") {
      setAddress({
        ...address,
        [name]: value,
      });
    }
    setUser((prev) => ({ ...prev, [name]: value }));
  };
  const updateAddressDetails = async () => {
    try {
      const response = await axiosInstance.post(
        "/user/account/addressupdate",
        address
      );
      console.log(response);
      toast.success(response?.data?.message);
      getAccount();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = () => {
    if (activeTab === "address") {
      if (handlechecking()) {
        const existing = Object.keys(orginaldata).length > 0;
        if (existing) {
          const check = Object.keys(address).some((val) => {
            // console.log(address[val],"=",orginaldata[val])
            if (address[val] !== orginaldata[val]) {
              return true;
            }
          });
          if (check) {
            updateAddressDetails();
          }
        } else {
          updateAddressDetails();
        }

        setEditMode(false);
      }
    }
    if(activeTab === 'profile'){
      const existing=Object.keys(orginaldata).length >0 
      if(existing){
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!user.name.trim()){
      toast.error('name is required')
      return false
    }
    if(!user.email.trim()){
      toast.error('email is required')
      return false
    }else if(!emailRegex.test(user.email)){
      toast.error('wrong email format')
      return false
    }

    if(user.phone){
      if(user.phone.length >10 ){
        toast.error('phone number exceeded ')
         return false
      }else if(user.phone.length <10){
        toast.error('phone number must be 10 ')
         return false
      }
      
    }
        let obj={}
        
        if(user.phone !== orginaldata.phone){
          obj.phone=user.phone
        }
        if(user.name !== orginaldata.username){
          obj.name=user.name
          
        }
        if(obj.email){
          console.log("inside email changed")
        }
        if(user.email !== orginaldata.email){

           sendOtp()
           obj.email=user.email
           return null
          //  setOtp(true)
        }
        if(Object.keys(obj).length > 0){
             handleProfile()
        }
        
        console.log("inside the existing",obj)
        return null
      }
      handleProfile()
    }

    // Here you would typically send the updated data to your backend
  };

  const sendOtp=async()=>{
    try {
      console.log("inside the send otp",user.email)
      const response=await axiosInstance.post('/user/changingemail/otp',{email:user.email})
      console.log(response)
      setOtp(true)
    } catch (error) {
      console.log(error)
    }
  }

  const handleProfile=async(code)=>{

     

    try {
      dispatch(showLoading())
      const response=await axiosInstance.put('/user/updateprofile',{user,code})
      setLoading(false)
      setOtp(false)
      setEditMode(false)
      console.log(response)
    } catch (error) {
      console.log(error)
    }finally{
      dispatch(hideLoading())
    }
  }
  const sub=(code)=>{
    console.log(code)
   setLoading(true)
   handleProfile(code)
  console.log(user)

  
  //
  }
  console.log(otp)
 

  return (
    <div className="flex flex-col">
      <Layout>

     {/* <Otp/> */}

    
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your profile and pet information
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => {
                  setActiveTab("profile");
                  setEditMode(false);
                }}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "profile"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Profile
              </button>

              <button
                onClick={() => {
                  setActiveTab("address");
                  setEditMode(false);
                }}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "address"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Address
              </button>
            </nav>
          </div>
          {
        otp && (
            <div className="fixed inset-0  backdrop-blur-xs flex items-center justify-center z-50">


          
          <Otp
          email={orginaldata?.email}
          otpsubmit={sub}
          loading={loading}
   

    />
    </div>
        )
      }

          {/* Profile Tab */}
          {activeTab === "profile" && (
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Personal Information
                </h2>
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center text-indigo-600 hover:text-indigo-800"
                  >
                    <FiEdit className="mr-1" /> Edit
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Save Changes
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <FiUser className="text-gray-400 mr-3" />
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <p className=" text-gray-900">{user.name}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <FiMail className="text-gray-400 mr-3" />
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    {editMode ? (
                      <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{user.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <FiPhone className="text-gray-400 mr-3" />
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    {editMode ? (
                      <input
                        type="tel"
                        name="phone"
                        value={user.phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{user.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "address" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Delivery Information
                </h2>
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center text-indigo-600 hover:text-indigo-800"
                  >
                    {orginaldata?.street && (
                      <>
                        <FiEdit className="mr-1" /> Edit
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Save Changes
                  </button>
                )}
              </div>
              <div className="flex items-center">
                <div className="w-full">
                  {editMode ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <label className="text-gray-500 font-medium">
                            Street
                          </label>
                          <input
                            type="text"
                            name="street"
                            value={address.street}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col ">
                          <label className="text-gray-500 font-medium">
                            city/village
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={address.city}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 my-3 gap-2">
                        <div className="flex flex-col ">
                          <label className="text-gray-500 font-medium">
                            district
                          </label>
                          <input
                            type="text"
                            name="district"
                            value={address.district}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex flex-col ">
                          <label className="text-gray-500 font-medium">
                            state/province
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={address.state}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 z gap-2">
                        <div className="flex flex-col mb-10">
                          {" "}
                          {/* Add margin-bottom */}
                          <label
                            htmlFor="state"
                            className="text-gray-500 font-medium"
                          >
                            country
                          </label>
                          <select
                            id="state"
                            name="country"
                            value={address.country}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="">
                              {address.country || "Select country"}
                            </option>
                            {countryNames.map((val, index) => (
                              <option key={index} value={val}>
                                {val}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex flex-col ">
                          <label className="text-gray-500 font-medium">
                            pin/postalcode
                          </label>
                          <input
                            type="text"
                            name="pin"
                            value={address.pin}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <label className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      {/* {
                 ! editMode &&(
                 
                 )
                 } */}
                      <div className="flex gap-3">
                        <FiMapPin className="text-gray-400 mt-2" />
                        {address?.street ? (
                          <p className="mt-1 text-gray-900">
                            {address?.street}, {address?.city}
                            <br />
                            {address?.district}, {address?.state}
                            <br />
                            {address?.country}
                            <br />
                            {address?.pin}
                          </p>
                        ) : (
                          <p className="text-sm font-medium text-gray-400">
                            please add address{" "}
                            <a
                              onClick={() => setEditMode(true)}
                              className="text-blue-600"
                            >
                              Click here
                            </a>
                          </p>
                        )}    
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
     </Layout>
    </div>
  );
};

export default Account;
