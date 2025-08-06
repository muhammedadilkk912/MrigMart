import React, { useEffect, useState } from 'react';
import axiosInstance from '../confiq/Axio';
import { useDispatch,useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../Redux/LoadingSlic';
import {toast} from 'react-hot-toast'
import Layout from '../component/Layout';

const CheckoutPage = () => {
  const cart=useSelector((state)=>state.cart.cart)
  console.log("cart",cart)
  
  console.log("cart=",cart)
  const subTotal = cart.reduce(
  (acc, item) => acc + (item.product.discountprice * item.quantity),
  0
);
let shipping=subTotal < 1000 ? 50 :0

  console.log(subTotal)
  const dispatch = useDispatch();
  const [address, setAddress] = useState({
    street: '',
    city: '',
    district: '',
    state: '',
    pin: '',
    country: 'United States' // Default country
  });
  const [mobile, setMobile] = useState('');
  const [editMode, setEditMode] = useState({
    phone: false,
    address: false
  });

  useEffect(() => {
    getAddress();
  }, []);

  const getAddress = async () => {
    try {
      dispatch(showLoading());
      const response = await axiosInstance.get('/user/getaddres');
      const data = response.data;
      console.log(data)
      
      if (data.phone) {
        setMobile(data.phone);
      }
      
      if (data.address) {
        setAddress({
          street: data.address.street || '',
          city: data.address.city || '',
          district: data.address.district || '',
          state: data.address.state || '',
          pin: data.address.pin || '',
          country: data.address.country || 'United States'
        });
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile') {
      setMobile(value);
    } else {
      setAddress(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleEditToggle = (field) => {
    setEditMode(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = async (field) => {
  
    try {
      // dispatch(showLoading());
      
      if (field === 'phone') {
        // Save mobile number
        console.log(mobile)
       const response= await axiosInstance.post('/user/updatemobile', {mobile} );
        
     }
       else if (field === 'address') {
        // Save address
        await axiosInstance.post('/user/updateAddress', { address });
      }
      
      setEditMode(prev => ({
        ...prev,
        [field]: false
      }));
    } catch (error) {
      console.error(`Error saving ${field}:`, error);
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleProceedToPayment = async() => {
    // Validate required fields
    if (!mobile || !address.street || !address.city || !address.state || !address.pin) {
      toast.error('Please fill in all required fields');
      return;
    }
    console.log("ttt",cart)

    try {
      
      const response=await axiosInstance.post('/user/payment',{
        cart,mobile,address,shipping,source:'cart'
      })
      console.log(response)
      window.location.href = response.data.url;
    } catch (error) {
      console.log(error)
    }
    
    // // Here you would typically call your Stripe integration
    // console.log('Proceeding to payment with:', { mobile, address });
    // // Example: redirectToStripeCheckout({ mobile, address });
  };

  return (
    <div className='flex flex-col '>
      <Layout>

      

    
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>
        
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Progress Steps */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white">
                  1
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">Information</span>
              </div>
              <div className="flex-1 border-t-2 border-gray-200 mx-4"></div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white">
                  2
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">Payment</span>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
            </div>
            
            {/* Phone Number Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Phone number</label>
                {mobile && !editMode.phone && (
                  <button 
                    onClick={() => handleEditToggle('phone')}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Edit
                  </button>
                )}
              </div>
              
              {mobile && !editMode.phone ? (
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <p className="text-gray-700">{mobile}</p>
                </div>
              ) : (
                <div className="flex">
                  <input
                    type="tel"
                    name="mobile"
                    value={mobile}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                  <button
                    onClick={() => handleSave('phone')}
                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>
          
        {/* Delivery Address Section */}
<div className="px-6 py-5 border-b border-gray-200">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-semibold text-gray-900">Delivery Address</h2>
    {!address?.street && !editMode.address ? (
      <button 
        onClick={() => handleEditToggle('address')}
        className="text-sm font-medium border border-gray-300 px-2 py-1 rounded-md text-indigo-600 hover:text-indigo-500"
      >
        Add Address 
      </button>
    ):(
      <button 
        onClick={() => handleEditToggle('address')}
        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 mt-2"
      >
        Edit
      </button>
    )}
  </div>
  
  {address?.street && !editMode.address ? (
    <div className="space-y-2">
      <div className="flex items-start">
        <svg className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <div>
          <p className="text-gray-700">{address.street}</p>
          <p className="text-gray-700">{address.city}, {address.district}, {address.state} {address.pin}</p>
          <p className="text-gray-700">{address.country}</p>
        </div>
      </div>
      
    </div>
  ) : (
    editMode.address && (
      <div className="space-y-4">
        <div>
          <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street address *</label>
          <input
            type="text"
            id="street"
            name="street"
            value={address.street || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City *</label>
            <input
              type="text"
              id="city"
              name="city"
              value={address.city || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="district" className="block text-sm font-medium text-gray-700">District</label>
            <input
              type="text"
              id="district"
              name="district"
              value={address.district || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">State/Province *</label>
            <input
              type="text"
              id="state"
              name="state"
              value={address.state || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="pin" className="block text-sm font-medium text-gray-700">PIN/Postal code *</label>
            <input
              type="text"
              id="pin"
              name="pin"
              value={address.pin || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country *</label>
          <select
            id="country"
            name="country"
            value={address.country || 'India'}
            onChange={handleInputChange}
            className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="Mexico">Mexico</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="India">India</option>
          </select>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => {
              if (!address?.street) {
                // If no address exists, cancel should hide the form
                setEditMode({...editMode, address: false});
              } else {
                // If editing existing address, return to view mode
                setEditMode({...editMode, address: false});
              }
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSave('address')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {address?.street ? "Update Address" : "Save Address"}
          </button>
        </div>
      </div>
    )
  )}
</div>
          
          {/* Order Summary Section */}
          <div className="bg-gray-50 px-6 py-5 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-sm font-medium text-gray-900">{subTotal}</p>
              </div>   
              <div className="flex justify-between">   
                <p className="text-sm text-gray-600">shipping</p>
                <p className="text-sm font-medium text-gray-900">{shipping}</p>
              </div>
             
              <div className="flex justify-between border-t border-gray-200 pt-4">
                <p className="text-base font-medium text-gray-900">Order total</p>
                <p className="text-base font-medium text-gray-900">{subTotal+shipping}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={handleProceedToPayment}
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Proceed to Payment
              </button>
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>By placing your order, you agree to our <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>.</p>
            </div>
          </div>
        </div>
      </div>   
      </div> 
      </Layout> 
    </div>
  );
};

export default CheckoutPage;