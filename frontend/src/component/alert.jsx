import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../confiq/Axio';
import { useDispatch } from 'react-redux';
import {toast} from 'react-hot-toast'
import { setLogout } from '../Redux/AuthSlic';
// import { setAuthentication } from '../redux/authSlice';
const Alert = ({ 
  isOpen=true, 
  onConfirm, 
  title = "Logout Confirmation",
  message = "Are you sure you want to logout?",
  cancelText = "Cancel"
}) => {   
  const dispatch=useDispatch()
  const [loading,setLoading]=useState(false)
  const navigate=useNavigate()
  if (!isOpen) return null;
  const naviagate=useNavigate()
  const onCancel=()=>{
    onConfirm(false)
    
  }    
   const handleLogout=async()=>{
    try {
       setLoading(true)
       const response=await axiosInstance.post('/user/logout')
       console.log(response)
       toast.success(response?.data?.message)
       setTimeout(() => {
         dispatch(setLogout(false))
       }, 200);
      
       onConfirm(true)
       
      //  naviagate('/')
      // onConfirm(true)
      // console.log(response)
    } catch (error) {
      console.log("error in logout ",error);
      
      
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleLogout}
            className={`px-4 py-2 flex justify-center text-white ${loading? 'bg-gray-400 cursor-not-allowed':' bg-red-600 hover:bg-red-700'} rounded-md transition-colors`}
          >{
            loading?(<>
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
                    </>): 'Logout'
          }
           
          </button>
        </div>
      </div>
    </div>
  );
};

// LogoutAlert.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   onConfirm: PropTypes.func.isRequired,
//   onCancel: PropTypes.func.isRequired,
//   title: PropTypes.string,
//   message: PropTypes.string,
//   confirmText: PropTypes.string,
//   cancelText: PropTypes.string
// };   

export default Alert;