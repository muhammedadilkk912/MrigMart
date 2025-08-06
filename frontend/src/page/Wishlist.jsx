import { useEffect } from 'react';
import { useState } from 'react';
import { FaTrash, FaShoppingCart, FaCartPlus } from 'react-icons/fa';
import axiosInstance from '../confiq/Axio';
import { useDispatch } from 'react-redux';
import { showLoading,hideLoading } from '../Redux/LoadingSlic';
import Layout from '../component/Layout';
const WishlistPage = () => {
    const dispatch=useDispatch()


  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(()=>{
    const getwhislist=async()=>{
        try {
            dispatch(showLoading())
            const response=await axiosInstance.get('/user/wishlist')
            setWishlistItems(response?.data?.wishlist)
            console.log('response=',response)
        } catch (error) {
            console.log(error)
        }finally{
            dispatch(hideLoading())
        }
    }
    getwhislist()
  },[])


  const removeFromWishlist = (id) => {
    setWishlistItems(prevItems => prevItems.filter(item => item._id !== id));
  };
  const  handleDelete=async(id)=>{
try {
    dispatch(showLoading())
    const response=await axiosInstance.delete(`/user/deletewishlist/${id}`)
    console.log(response)
    console.log("id=",id)
    removeFromWishlist(id)
} catch (error) {
    console.log('error=',error)
}finally{
    dispatch(hideLoading())
}
  }

  const addToCart = (id) => {
    alert(`Item ${id} added to cart!`);
  };

  const addAllToCart = () => {
    const inStockItems = wishlistItems.filter(item => item.inStock);
    if (inStockItems.length === 0) {
      alert('No items in stock to add to cart!');
      return;
    }
    alert(`Added ${inStockItems.length} items to cart!`);
  };

  const totalValue = wishlistItems.reduce((sum, item) => sum + item.product.discountprice, 0);
  const inStockItemsCount = wishlistItems.filter(item => item).length;

  return (
    <div className='min-h-screen flex flex-col  '>

    
    <Layout>
    <div className="container mx-auto px-4 py-8 ">
        
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Wishlist</h1>
        <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
          <p className="text-gray-600">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} • Total: ${totalValue.toFixed(2)}
          </p>
          
        </div>
      </header>

      {/* Wishlist items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {wishlistItems.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg">Your wishlist is empty</p>
            <p className="mt-2">Start adding items you love!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {wishlistItems.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Product image and name */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.name} 
                      className="w-16 h-16 object-cover rounded border border-gray-200"
                    />
                    <div className="min-w-0">
                      <h3 className="font-medium text-lg truncate">{item.product.name}</h3>
                      
                      {/* <p className="text-sm text-gray-500">Added: {new Date(item.createdAt).toLocaleDateString()}</p>   */}
                    </div>
                  </div>

                  {/* Price and status */}
                  <div className="flex items-center gap-6 sm:w-48 justify-between sm:justify-end">
                    <div className="text-right">
                      <div className="font-bold text-gray-800">${item.product.discountprice}</div>
                      <div className={`text-xs px-2 py-1 rounded-full inline-block ${item.product.stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.product.stock ? 'In Stock' : 'Out of Stock'}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2  justify-end">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      aria-label="Remove"
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => addToCart(item.id)}
                    //   disabled={!item.product.stock}
                      className={`px-2 py-3 rounded-md flex gap-2 justify-center items-center transition-colors ${item.product.stock >0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                      aria-label="Add to cart"
                    >
                      <FaShoppingCart className="h-4 w-4" />  
                      <span className="text-sm">Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    
      </div>
        </Layout>
    </div>
  );
};

export default WishlistPage;