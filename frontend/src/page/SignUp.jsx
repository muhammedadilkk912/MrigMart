import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineUser, AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import {toast} from 'react-hot-toast';
import axiosInstance from '../confiq/Axio';
import Otp from '../component/Otp';

const SignUp = () => {
  const navigate=useNavigate()
    const [data,setData]=useState({
        username:'',
        email:'',
        password:'',
        confirmPassword:''
        
    })
    const [error,setError]=useState({ })
    const [open,setOpen]=useState(false)
    const [loading,setLoading]=useState(false)

    const handlechage=(e)=>{
    const{name,value}=e.target
    setData({...data,[name]:value})   
  }

    const validation=()=>{
        setError({})
        if(!data.username.trim()){
            toast.error('user name is required')
            setError({username:true})
            return false
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email.trim()) {
    setError({ email:true})
    toast.error('email is required')
    return false
  } else if (!emailRegex.test(data.email)) {
     setError({ email:true})
   
     toast.error("Invalid email format")
    return false
  }

  if (!data?.password?.trim()) {
    setError({ password:true})
    toast.error("password is required")
    return false
  } else if (data.password.length < 6) {
    toast.error('Password must be at least 6 characters')
   setError({ password:true})
   
    
    return false
  }else if(data.password.length >10){
    setError({ password:true})
    console.log("dsakjdfh")
    toast.error("password cannot excess 10 characters")
    return false
  } 

  if(!data?.confirmPassword?.trim()){  
    toast.error("confirm password is required")
    setError({confirmPassword:true})
    return false
  }if(data.password !== data.confirmPassword){
    toast.error("confirm password do not match")
    setError({confirmPassword:true})
    return false
  }
  
  return true
    }
  const handleSubmit = async(e) => {
    e.preventDefault();
    // console.log(validation())
    if(validation()){
        try {
          setLoading(true)
            const response=await axiosInstance.post('/auth/signup',data)
            console.log(response)
            toast.success(response?.data?.message)
            setOpen(true)
        } catch (error) {
            toast.error(error?.response?.data?.message)
            console.log("error submit user=",error)
        }finally{
        
          setLoading(false)
        }
       console.log("Registration form submitted",data);
    }
    // Form submission logic would go here
   
  };
  const otpsubmit=async(otp)=>{
    console.log("otp",otp)
    if(otp){
      try {
        setLoading(true)
        const response =await axiosInstance.post('/auth/verifyOtp',{otp,email:data.email})
        console.log("otp response")
        toast.success(response?.data?.message)
        navigate('/login')
      } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message)
      }finally{
        setLoading(false)

      }
    }


  }
    const handleGoogleSignUp = () => {
     const baseURL = import.meta.env.VITE_API_BASE_URL;
    // console.log("baseURL=",baseURL)
    // https://mrigmart-backend.onrender.com/api/auth/google/callback
    // return null

  window.open(`${baseURL}/auth/google`, "_self");
  //  window.location.href=`${baseURL}/auth/google`
};


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">{
      open?(
        <Otp email={data.email} otpsubmit={otpsubmit} loading={loading}/>
      ):(
        <>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[#ABBB19] hover:text-[#9aaa10]">
            Sign in  
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Registration Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="username"
                  type="text"
                  autoComplete="name"
                  onChange={(e)=>handlechage(e)}
                  value={data.username}
                  className={`py-2 pl-10 block w-full border ${error.username?'border-red-500':'border-gray-300 '} rounded-md focus:outline-none focus:ring-2 focus:ring-[#ABBB19] focus:border-[#ABBB19]`}
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  onChange={(e)=>handlechage(e)}
                  autoComplete="email"
                  value={data.email}
                  className={`py-2 pl-10 block w-full border ${error.email?'border-red-500':'border-gray-300 '} rounded-md focus:outline-none focus:ring-2 focus:ring-[#ABBB19] focus:border-[#ABBB19]`}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={(e)=>handlechage(e)}
                  autoComplete="new-password"
                  value={data.password}
                  className={`py-2 pl-10 block w-full border ${error.password?'border-red-500':'border-gray-300 '} rounded-md focus:outline-none focus:ring-2 focus:ring-[#ABBB19] focus:border-[#ABBB19]`}
                  placeholder="••••••••"
                />
              </div>
              {/* <p className="mt-2 text-sm text-gray-500">
                Use 8 or more characters with a mix of letters, numbers & symbols
              </p> */}
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  onChange={(e)=>handlechage(e)}
                  autoComplete="new-password"
                  value={data.confirmPassword}
                  className={`py-2 pl-10 block w-full border ${error.confirmPassword?'border-red-500':'border-gray-300 '} rounded-md focus:outline-none focus:ring-2 focus:ring-[#ABBB19] focus:border-[#ABBB19]`}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-[#ABBB19] focus:ring-[#ABBB19] border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the <a href="#" className="text-[#ABBB19] hover:text-[#9aaa10]">Terms</a> and <a href="#" className="text-[#ABBB19] hover:text-[#9aaa10]">Privacy Policy</a>
              </label>
            </div> */}

            <div>
              <button
                type="submit"
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ABBB19] hover:bg-[#9aaa10] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ABBB19]
                   ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
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
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or sign up with
                </span>
              </div>
            </div>
          </div>

          {/* Google Sign Up */}
          <div className="mt-6">
            <button
              type="button"
              onClick={()=>handleGoogleSignUp()}
              className="w-full inline-flex justify-center items-center py-2 px-4 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ABBB19]"
            >
              <FcGoogle className="h-5 w-5 mr-2" />
              Sign up with Google
            </button>
          </div>
        </div>
      </div>
 
    </>  )
    }
      
    </div>
  );
};

export default SignUp;