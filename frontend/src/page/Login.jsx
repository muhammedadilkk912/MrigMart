import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import {toast} from 'react-hot-toast'
import {  Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../confiq/Axio'
import {useDispatch} from 'react-redux'
import {setLogin,setWishlist}  from '../Redux/AuthSlic'

const Login = () => {
  const dispatch=useDispatch()
  const navigate=useNavigate()
    const [form,setForm]=useState({email:'',password:''})
    const [loading,setLoading]=useState(false)


     const handlechage=(e)=>{
    const{name,value}=e.target
    setForm({...form,[name]:value})
  }

  const validation = () => {
    console.log("validation")
  const errors = {};
 
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email.trim()) {
    errors.email = "Email is required";
    toast.error('email is required')
    return false
  } else if (!emailRegex.test(form.email)) {
    errors.email = "Invalid email format";
     toast.error("Invalid email format")
    return false
  }
  console.log("password=",form.password)

  // Password validation
  if (!form.password.trim()) {
    errors.password = "Password is required";
    toast.error("password is required")
    return false
  } else if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
    toast.error('Password must be at least 6 characters')
    return false
  }else if(form.password.length >10){
    toast.error("password cannot excess 10 characters")
    return false
  }  
//   return errors;
return true
};
 const handleSubmit =async (e) => {
      
       

    e.preventDefault()
    if(validation()){
         try {
          setLoading(true)
          const response=await axiosInstance.post('/auth/signin',form)
          console.log(response)
          if(response?.data?.whislist.length > 0){
            dispatch(setWishlist(response?.data?.whislist))
            

          }
            
        
          dispatch(setLogin()) 
          navigate('/')
          toast.success(response?.data?.message)
         } catch (error) {
          console.log(error)
          toast.error(error?.response?.data?.message)
         }finally{
             setLoading(false)
         }
    }
    
    // Form submission logic would go here
   
  };
  const handleGoogleLogin = () => {
     const baseURL = import.meta.env.VITE_API_BASE_URL;
    // console.log("baseURL=",baseURL)
    // https://mrigmart-backend.onrender.com/api/auth/google/callback
    // return null

  window.open(`${baseURL}/auth/google`, "_self");
  //  window.location.href=`${baseURL}/auth/google`
};



  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Email/Password Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                  autoComplete="email"
                  onChange={(e)=>handlechage(e)}
                  value={form.email}
                  className="py-2 pl-10 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ABBB19] focus:border-[#ABBB19]"
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
                  autoComplete="current-password"
                  onChange={(e)=>handlechage(e)}
                  value={form.password}
                  className="py-2 pl-10 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ABBB19] focus:border-[#ABBB19]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"

                  type="checkbox"
                  className="h-4 w-4 text-[#ABBB19] focus:ring-[#ABBB19] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link 
                to='/forgetpasssword'
                 className="font-medium text-[#ABBB19] hover:text-[#9aaa10]">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
               
              
              <button
                type="submit"
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ABBB19] hover:bg-[#9aaa10] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ABBB19]
                  ${loading?'opacity-75 cursor-not-allowed' : ''}
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
                      Login...
                    </>
                  ) : (
                    'Sign in '
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
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          {/* Google Sign In */}
          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full inline-flex justify-center items-center py-2 px-4 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ABBB19]"
            >
              <FcGoogle className="h-5 w-5 mr-2" />
              Sign in with Google
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to='/signup' className="font-medium text-[#ABBB19] hover:text-[#9aaa10]">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;