import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../confiq/Axio';
import Layout from '../component/Layout';
import FilterSidebar from '../component/FilterSidebar'
import { CiFilter } from 'react-icons/ci';
import ProductCard from '../component/ProductCard';
import Pagination from '../component/Pagination';
import { useDebounce } from 'use-debounce';
import { IoClose } from 'react-icons/io5';

const Searchbyproducts = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  console.log(query)
  const [filters, setFilters] = useState({
    priceRange: [0, null],
    ratings: null,
    sortBy: "popular",
    inStock: false,
  });
  const [products, setProducts] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [maxPrice,setMaxPrice]=useState(null)
  const [loading, setLoading] = useState(false);
  const [debouncePriceRanges] = useDebounce(filters.priceRange, 500);
  const [hasSearchedOnce, setHasSearchedOnce] = useState(false);


  useEffect(() => {
    if(filterOpen){
      setFilterOpen(false)
    }
    getProducts();
  }, [searchParams,debouncePriceRanges,filters.inStock,filters.sortBy,pagination.page,filters.ratings]);
  console.log(filters)

  const getProducts = async () => {
    setLoading(true);
    const [min, max] = filters.priceRange;
    let url = `/searchproducts`;
    const params = [];
    
    if (query) params.push(`search=${query}`);
    if (max !== null) params.push(`max=${max}`);
    if (filters.ratings) params.push(`ratings=${filters.ratings}`);
    params.push(`min=${min}`);
    params.push(`sortBy=${filters.sortBy}`);
    params.push(`inStock=${filters.inStock}`);
    params.push(`page=${pagination.page}`);
    // params.push(`limit=${pagination.limit}`);
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    try {
      const response = await axiosInstance.get(url);
      const data = response?.data;
      console.log(data)
      console.log(data.totalpage)
      setProducts(data?.products || []);
      setMaxPrice(data?.maxprice)
      setPagination((prev) => ({
  ...prev,
  totalPages: data?.totalpage ?? 0
}));


    } catch (error) {
      console.log("error in get products", error);
      if(error.response.status===400){
        setProducts([])
        if (!hasSearchedOnce) {
    setHasSearchedOnce(true);
  }
      }
    } finally {
      setLoading(false);
       
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // console.log("initail mount",initial)

  return (
    <div className='min-h-screen w-full flex flex-col'>
      <Layout>
        <div className='w-full mx-auto py-3 px-3 md:px-4 lg:px-6'>
         {
  loading && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )
}
{/* {console.log("has=",hasSearchedOnce,"length",products?.length,"loading",loading)} */}
{/* {console.log(products.length)} */}
{
  
   (hasSearchedOnce && products.length === 0 )&& !loading?(
    <div className='min-h-screen flex justify-center items-center w-full'>
      
         <p className='text-gray-500'>product not found ..</p>
    </div>
  ):(

 

          <div className='flex flex-col sm:pt-10 md:flex-row'>
            {/* Mobile Filter Button */}
            <div className='flex justify-between items-center sm:hidden mb-4'>
              <button
                onClick={() => setFilterOpen(true)}
                className="flex gap-2 items-center border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <CiFilter className="h-5 w-5" />
                Filters
              </button>
              <div className="flex items-center space-x-2">
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Top Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>

            {/* Filter Sidebar - Desktop */}
            <div className='hidden sm:block w-64 pr-4'>
              {
                maxPrice&&(
                        <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                maxprice={maxPrice}
              />
                )
              }
             
            </div>

            {/* Filter Sidebar - Mobile */}
            {filterOpen && (
             
               <div className="fixed backdrop-blur-xs inset-0 z-50 flex">
                             <div
                               className="fixed  inset-0 "
                               onClick={() => setFilterOpen(false)}
                             />
                             <div className="relative top-14  h-full  flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                               <div className="flex items-center justify-between px-4">
                                 <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                                 <button
                                   type="button"
                                   className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md p-2 text-gray-400"
                                   onClick={() => setFilterOpen(false)}
                                 >
                                   <IoClose className="h-6 w-6" />
                                 </button>
                               </div>
                               <div className="mt-4">
                                 <FilterSidebar
                                   filters={filters}
                                   setFilters={setFilters}
                                   maxprice={maxPrice}
                                 />
                               </div>
                             </div>
                           </div>
            )}

            {/* Main Content */}
            <div className='w-full px-1 sm:px-2 md:px-4'>
              {/* Desktop Sort */}
              <div className='hidden sm:flex justify-end mb-4'>
                <div className="flex items-center space-x-4">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Top Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest Arrivals</option>
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              {!loading && products.length > 0 ? (
                <>
                  <div className='grid gap-2 sm:gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                  {
                    console.log("totttal=",pagination.totalPages)
                  }

                  {/* Pagination */}
                  <Pagination
                   currentPage={pagination.page}
                   totalPage={pagination.totalPages}
                   onPageChange={handlePageChange}
                   />
                  
                </>
              ) : !loading && (
                <div className="flex justify-center items-center h-64">
                  <p className="text-gray-500">No products found</p>
                </div>
              )}
            </div>
          </div>
           )
}
        </div>
      </Layout>
    </div>
  )
}

export default Searchbyproducts