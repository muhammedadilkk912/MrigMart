import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "../confiq/Axio";
import Otp from "../component/Otp";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
// import OtpVerification from "./OtpVerification";
// import ResetPasswordForm from "./ResetPasswordForm";

const Forgetpass = () => {
    const navigate=useNavigate()
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("email"); // "email" | "otp" | "reset"
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 
  const [data,setData]=useState({
    password:'',
    confirmPassword:''
  })

  const inputRefs=useRef({
    password:null,
    confrimPassword:null
  })

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const validateEmail = () => {
    console.log("insdekndnfkja");
    if (!email.trim()) {
      setError("Email is required");
      toast.error("Email is required");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address");
      toast.error("please enter valid email address");
      return false;
    }
    return true;
  };

  const handleSubmitEmail = async (e) => {
    console.log("inside handle sub,it");
    e.preventDefault();
    console.log(validateEmail());

    if (!validateEmail()) return;

    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/auth/forget-password", {
        email,
      });

      if (response.status === 200) {
        setStep("otp");
        setIsLoading(true)
        // setLoading(!loading);
        toast.success("OTP sent to your email!");
      }
    } catch (err) {
      console.error("Password reset error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to send OTP. Please try again later."
      );
      toast.error(err?.response?.data?.message)
    } finally {
      setIsLoading(false);
    }
  };
  const resetPassword=async ()=>{
    if(!data.password.trim()){
      toast.error('passord is required')
      return false
    }else if(data.password.length < 6){
      toast.error('passord must 6 or more characters')
      return false
    }else if(data.password.length > 10){
       toast.error('password should be less than 10 characters')
       return false
    }
    if(!data.confirmPassword.trim()){
      toast.error('confirm passord is required')
      return false
    }else if(data.confirmPassword.length < 6){
      toast.error('passord must 6 or more characters')
      return false
    }else if(data.confirmPassword.length > 10){
       toast.error('password should be less than 10 characters')
       return false
    }else if(data.password !== data.confirmPassword){
      toast.error('Confirm password do not  match')
      return false
    }
    try {
      const response=await axiosInstance.put(`/auth/resetpassword/${email}`,data)
      console.log(response)
      toast.success(response?.data?.message)
      navigate('/login')     
    } catch (error) {
      toast.error(error?.respo?.data?.message)
      console.log(error)
    }
  }

 const  passValidation=()=>{
      inputRefs.current.password.classList.remove('border-red-500', 'border-2');
  inputRefs.current.confrimPassword.classList.remove('border-red-500', 'border-2');
    console.log(data)
    if(!data.password.trim()){
        toast.error("password is required")
        console.log("inside toast")
        inputRefs.current.password.classList.add('border-red-500', 'border-2');
        return false

    }if(data.password.length<6){
                inputRefs.current.password.classList.add('border-red-500', 'border-2');

        toast.error("minimum 6 characters needed")
         return false
    }
    if(data.password.length>10){
                inputRefs.current.password.classList.add('border-red-500', 'border-2');

         toast.error("maximim 10 characters allowed")
         return false


    }
    
    if(!data.confirmPassword.trim()){
                inputRefs.current.confrimPassword.classList.add('border-red-500', 'border-2');

        toast.error("confirm pssword is required")
        return false

    }
    if(data.confirmPassword!==data.password){
    inputRefs.current.confrimPassword.classList.add('border-red-500', 'border-2');        toast.error("password are not equal")
        return false
    }
    return true
 }

   const  passwordSubmit=async(e)=>{
    e.preventDefault()
    
    const validate=passValidation()
    if(validate){
        console.log("success")
        try {
            let ff='djs'
            setIsLoading(!isLoading)
            console.log(data,email)
            const response=await axiosInstance.put(`/auth/resetpassword/${email}`,data)
            console.log(response)
            toast.success("pssword updated successfully")
            navigate('/')
        } catch (error) {
            toast.error(error?.response?.data?.message)
            console.log("error change passord",error)
            
        }finally{
            setIsLoading(false)
        }
    }
        
   }

    const handleVerifyOtp = async (otp) => {
        // console.log("===",otp)
      try {
        setLoading(!loading)
        const response = await axiosInstance.post("/auth/verifyOtp", {
          email,
          otp
        });
     
        if (response.status === 200) {
          setStep("reset");
          toast.success("OTP verified successfully");
        }
      } catch (err) {
        console.error("OTP verification error:", err);
        toast.error(err?.response?.data?.message)
        // throw err.response?.data?.message || "Invalid OTP. Please try again.";
      }finally{
        setLoading(false)
      }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
      {step === "email" ? (
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">
              Reset Your Password
            </h2>
            <p className="text-gray-500">
              Enter your registered email address and we'll send you an OTP to
              reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmitEmail} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className={`mt-1 block w-full px-3 py-2 border ${
                  error ? "border-red-500 border-2" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="your@email.com"
                value={email}
                onChange={handleEmailChange}
                autoFocus
              />
              {/* {error && <p className="mt-1 text-sm text-red-600">{error}</p>} */}
            </div>

            <button
              type="submit"
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Sending...
                </>
              ) : (
                "Send OTP"
              )}
            </button>
          </form>
        </div>
      ) : step === "otp" ? (
        <Otp loading={loading} otpsubmit={handleVerifyOtp} />
      ) : (
        <div className="sm:w-2/4 bg-white px-6  py-6 rounded-xl space-y-3 shadow-md">
          <h1 className="font-medium text-2xl">Change Password</h1>
          <form onSubmit={passwordSubmit} className="space-y-4">
            <div>
              <label className="block my-2 font-medium text-gray-700">
                New passoword
              </label>
              <input name="passoword" ref={(el)=>(inputRefs.current.password=el)} 
                onChange={(e)=>setData((prev)=>({...prev,password:e.target.value}))} className="w-full border px-2  py-2 border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block my-2 font-medium text-gray-700">
                Confirm passoword
              </label>
              <input  onChange={(e)=>setData((prev)=>({...prev,confirmPassword:e.target.value}))} 
               name="confrimPassword"
               ref={(el)=>(inputRefs.current.confrimPassword=el)} 
              className="w-full border px-2  py-2 border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <button
              type="submit"
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Updating...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Forgetpass;
