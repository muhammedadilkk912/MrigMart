

import { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import axiosInstance from '../confiq/Axio';
import {toast} from 'react-hot-toast';

const AddReview = ({ product,onCancel,onSubmit }) => {
  console.log("product=",product.product.productId._id)
  const productId=product.product.productId._id
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [loading,setLoading]=useState(false)
  const isDisabled = rating === 0 || reviewText.trim() === '' || loading;

  const handleSubmit = async(e) => {
    e.preventDefault()
    console.log(rating,reviewText)
    if(rating === 0){
      toast.error('rating is required')
      return null
    }
    if(reviewText.trim()==''){
      toast.error('comment is required')
      return null
    }
    
  
   
    try {
        setLoading(true)
        const response=await axiosInstance.post('/user/addreview',{reviewText,rating,productId,orderId:product.orderId})
        console.log(response)
        toast.success(response?.data?.message)
         onSubmit()
    } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message)
    }finally{
        setLoading(false)
    }
   
  }
    // onSubmit({ rating, review: reviewText });
  // };

  return (
    <div className="my-4 p-2 mx-1 sm:mx-0 w-full flex flex-col items-start shadow-2xl  sm:w-1/2 bg-white bg-gradient-to-b rounded-lg border border-gray-200">
      <h3 className="text-2xl font-medium text-gray-500 mb-2">Review for {product.product.productId.name}</h3>
      <form className='w-full' onSubmit={handleSubmit} >

      
      
      {/* Star Rating */}
      <div className="flex items-center mb-5">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              <FiStar
                className={`w-5 h-5 ${(hoverRating || rating) >= star ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
              />
            </button>
          ))}
        </div>
        <span className="ml-2 text-xs text-gray-500">
          {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Rate this product'}
        </span>
      </div>

      {/* Review Text */}
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Share your experience with this product..."
        className="w-full p-2 text-sm border rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        rows="5"
      />

      {/* Action Buttons */}
      <div className="flex w-full justify-end mt-3 space-x-2">
        <button
          onClick={onCancel}
          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
        type='submit'
  // onClick={handleSubmit}
  disabled={isDisabled}
  className={`px-3 py-2 text-sm flex text-white rounded-md ${
    isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
  }`}
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
    'Submit Review'
  )}
</button>
      </div>
      </form>
    </div>
  )
};

export default AddReview;