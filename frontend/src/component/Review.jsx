import React, { useState } from 'react';
// import { StarIcon } from '@heroicons/react/24/solid';
import { CiStar } from "react-icons/ci";


const Review = ({reviews}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedReview, setExpandedReview] = useState(null);
  console.log("reivews=",reviews)
   
  
//     const reviews = [
//     {
//       id: 1,
//       rating: 5,
//       title: "Excellent product!",
//       author: "John Doe",
//       date: "June 15, 2023",
//       content: "This product exceeded all my expectations. The quality is outstanding and it arrived earlier than expected. I would definitely recommend this to anyone looking for a reliable solution. The customer service was also very helpful when I had questions about the features.",
//       images: [
//         "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
//         "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
//       ]
//     },
//     {
//       id: 2,
//       rating: 4,
//       title: "Good value for money",
//       author: "Jane Smith",
//       date: "May 28, 2023",
//       content: "I'm satisfied with my purchase. It works well and looks good. The only reason I'm not giving 5 stars is because the instructions could be clearer.",
//       images: []
//     },
//     {
//       id: 3,
//       rating: 3,
//       title: "Average experience",
//       author: "Robert Johnson",
//       date: "April 10, 2023",
//       content: "The product is okay but not exceptional. It does what it's supposed to but I expected better quality for the price. Delivery was fast though.",
//       images: []
//     },
//     {
//       id: 4,
//       rating: 5,
//       title: "Absolutely love it!",
//       author: "Sarah Williams",
//       date: "March 22, 2023",
//       content: "This is my second purchase of this item and I'm just as happy as the first time. The design is beautiful and it's very functional. Will buy again!",
//       images: [
//         "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
//       ]
//     },
//     {
//       id: 5,
//       rating: 2,
//       title: "Disappointed",
//       author: "Michael Brown",
//       date: "February 5, 2023",
//       content: "The product arrived damaged and it took a week to get a replacement. The replacement works but the quality is not what I expected based on the product description.",
//       images: []
//     }
//   ];   

  // Filter reviews based on active tab
  const filteredReviews = activeTab === 'all' 
    ? reviews 
    : reviews.filter(review => review.rating === parseInt(activeTab));   
    console.log("filter review are=",filteredReviews)

  // Calculate average rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({  
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: (reviews.filter(r => r.rating === star).length / reviews.length) * 100
  }));
  console.log('rating distribution=',ratingDistribution)

  const toggleReviewExpansion = (id) => {
    setExpandedReview(expandedReview === id ? null : id);
  }; 

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
      
      {/* Rating Summary */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
          <span className="text-5xl font-bold text-gray-800">{averageRating.toFixed(1)}</span>
          <div className="flex mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <CiStar 
                key={star}
                className={`h-5 w-5 ${star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 mt-1">{reviews.length} reviews</span>
        </div>
        
        {/* Rating Distribution */}
        <div className="flex-1">
          {ratingDistribution.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center mb-2">
              <span className="w-8 text-sm font-medium text-gray-600">{star} star</span>
              <div className="flex-1 mx-2 h-2.5 bg-gray-200 rounded-full">
                <div 
                  className="h-2.5 bg-yellow-400 rounded-full" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="w-8 text-sm text-gray-600 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Review Filter Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
        >
          All Reviews ({reviews.length})
        </button>
        {[5, 4, 3, 2, 1].map((rating) => (
          <button
            key={rating}
            onClick={() => setActiveTab(rating.toString())}
            className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${activeTab === rating.toString() ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
          >
            <span>{rating} star</span>
            <span className="ml-1">({reviews.filter(r => r.rating === rating).length})</span>
          </button>
        ))}
      </div>
      
      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.length > 0 ? (  
          filteredReviews.map((review) => (
            <div key={review.id} className="border border-gray-200 py-2 rounded-lg px-2 ">
              <div className="flex items-center mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <CiStar
                      key={star}
                      className={`h-5 w-5 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-600">{review.rating}.0</span>
              </div>
              
              {/* <h3 className="text-lg font-semibold text-gray-800">{review.title}</h3> */}
              
              <div className="flex items-center mt-1 mb-3">
                <span className="text-sm text-gray-600">By {review.user.username}</span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-sm text-gray-500">{review.updatedAt}</span>
              </div>
              
              <p className={`text-gray-700 ${expandedReview === review.id ? '' : 'line-clamp-3'}`}>
                {review.comment}
              </p>
              
              {review.comment.length > 200 && (
                <button 
                  onClick={() => toggleReviewExpansion(review.id)}
                  className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  {expandedReview === review.id ? 'Show less' : 'Read more'}
                </button>
              )}
              
              {/* {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {review.images.map((image, index) => (
                    <img 
                      key={index}
                      src={image}
                      alt={`Review ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-md cursor-pointer hover:opacity-80"
                    />
                  ))}
                </div>
              )} */}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No reviews found for this filter.</p>
          </div>
        )}
      </div>
      
     
    </div>
  );
};
export default Review

// Example usage with sample data



//   return <ReviewComponent reviews={sampleReviews} />;
// };

