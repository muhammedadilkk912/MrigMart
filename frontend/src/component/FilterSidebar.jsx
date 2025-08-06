import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

const FilterSidebar = ({ filters, setFilters,maxprice }) => {
  function valuetext(value) {
  return `$${value}`;
}
const PRICE_MIN = 0;
const PRICE_MAX = maxprice;
console.log("max amount=",maxprice)
const MIN_DISTANCE = 500;    

const [priceRange, setPriceRange] = React.useState([PRICE_MIN, PRICE_MAX]);

const handlePriceChange = (event, newValue, activeThumb) => {
  if (!Array.isArray(newValue)) return;
  // console.log("active thumb=",activeThumb)

  const [min, max] = priceRange;
  if (activeThumb === 0) {
    const newMin = Math.min(newValue[0], max - MIN_DISTANCE);
    setPriceRange([newMin, max]);
    setFilters({...filters,priceRange:[newMin,max]})
  } else {
    const newMax = Math.max(newValue[1], min + MIN_DISTANCE);
    setPriceRange([min, newMax]);
    setFilters({...filters,priceRange:[min,newMax]})
  }
};

console.log('price ranges=',priceRange)



 

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-64">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-xl">Filters</h3>
        <button 
          onClick={() => setFilters({
            priceRange: [0, 1000],
            ratings: null,
            inStock: false,
            categories: []
          })}
          className="text-blue-600 text-sm hover:underline"
        >
          Clear all
        </button>
      </div>
      
    

      {/* Price Range */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-700 mb-4 text-lg">Price Range</h4>
         <Box sx={{ width: 200 }}>
     <Slider
  getAriaLabel={() => 'Minimum distance'}
  value={priceRange}
  min={PRICE_MIN}
  max={PRICE_MAX}
  onChange={handlePriceChange}
  valueLabelDisplay="auto"
  getAriaValueText={valuetext}
  disableSwap
/>

      
    </Box>
    <div className="flex justify-between">
       <span> {priceRange[0]} </span> <span>{priceRange[1]}+</span>
      </div>
      </div>

      {/* Ratings */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-700 mb-3 text-lg">Customer Rating</h4>
        <div className="space-y-3">
          {[5,4, 3, 2, 1].map(rating => (
            <div key={rating} className="flex items-center">
              <input
                type="checkbox"
                id={`rating-${rating}`}

                name="check"
                checked={filters.ratings?.includes(rating) || false}
                onChange={(e) => {
            const newRatings = e.target.checked
              ? [...(filters.ratings || []), rating]
              : (filters.ratings || []).filter(r => r !== rating);
            
            setFilters({
              ...filters,
              ratings: newRatings.length > 0 ? newRatings : null
            });
          }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={`rating-${rating}`} className="flex items-center ml-3">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="mb-6">
        <div className="flex flex-col ">
          <h4 className="font-semibold text-gray-700 mb-3 text-lg">Stock</h4>

         <div className='flex'>
           <input
            type="checkbox"
            id="inStock"
            checked={filters.inStock}
            onChange={(e) => setFilters({
              ...filters,
              inStock: e.target.checked
            })}
            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label 
            htmlFor="inStock" 
            className="ml-3 text-sm text-gray-700"
          >
            In Stock Only
          </label>

         </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;