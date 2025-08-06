import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "../component/ProductCard";
import FilterSidebar from "../component/FilterSidebar";
import axiosInstance from "../confiq/Axio";
import { CiFilter } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { useDebounce } from "use-debounce";
import Layout from "../component/Layout";


const ProductByCategory = () => {
  const isFirstLoad = useRef(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [maxprice,setMaxprice]=useState(null)


  const [filters, setFilters] = useState({
    priceRange: [0,0],
    ratings: null,
    sortBy: "popular",
    inStock: false,
  
  });
  // console.log("filetr=",filters)
  const [debouncePriceRanges] = useDebounce(filters.priceRange, 500);
    // Fetch products by category in initial mount
  useEffect(() => {
    fetchProducts();
  }, [id]);

  useEffect(() => {
    if (isFirstLoad.current) {
    isFirstLoad.current = false;
    return;
  }
     if (maxprice) {
    fetchFilteredProducts();
  }
  }, [debouncePriceRanges]);
  // 🟢 Set max price when fetched
useEffect(() => {
  if (maxprice) {
    setFilters((prev) => ({
      ...prev,
      priceRange: [0, maxprice],
    }));
  }
}, [maxprice]);

  // Fetch products by category in initial mount
  useEffect(() => {
    fetchProducts();
  }, [id]);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/productsbycategory/${id}`);
      console.log("rep=",response)
      const data = response?.data?.products;

      // console.log("data=", data);
      // console.log("product list=",data[0].products)
      console.log("***",data[0].products)
      setProducts(data[0].products);
      setCategoryName(response?.data?.categoryName || "Category");
      if(data[0].maxprice){
        console.log("old max price",maxprice)
        let max=customRoundByThreeDigits(data[0].maxprice)
         setMaxprice(max)
        
      }

      // Extract unique categories from products
      
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(()=>{
    if(mobileFiltersOpen)setMobileFiltersOpen(false)
      
       if (maxprice) {
    fetchFilteredProducts();
  }
  },[filters.ratings,filters.inStock,filters.sortBy])

  const fetchFilteredProducts=async()=>{
    
    try {
      setLoading(true)
     console.log(filters)
      const response=await axiosInstance.get(`/filteredproducts/${id}`, {
      params: {
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        ratings: JSON.stringify(filters.ratings),
        sortBy: filters.sortBy,
        inStock: filters.inStock,
      },
      
    });
    console.log("console.log",response)
    setProducts(response?.data?.products)
    } catch (error) {
      if(error.status===400){
        setProducts([])
      }
      console.log(error)
    }finally{
       setLoading(false)
    }
  }

 

 
  function customRoundByThreeDigits(value) {
  const lastThree = value % 1000;
  const base = value - lastThree;

  if (lastThree <= 500) {
    return base + 500;
  } else {
    return base + 1000;
  }
}

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Layout>
        <div className={`w-full  mx-auto px-4  py-8 max-w-7xl`}>
          {/* Mobile filter dialog */}
          {mobileFiltersOpen && (
            <div className="fixed backdrop-blur-xs inset-0 z-50 flex">
              <div
                className="fixed  inset-0 "
                onClick={() => setMobileFiltersOpen(false)}
              />
              <div className="relative top-14  h-full  flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    type="button"
                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <IoClose className="h-6 w-6" />
                  </button>
                </div>
                <div className="mt-4">
                  <FilterSidebar
                    filters={filters}
                    setFilters={setFilters}
                    maxprice={maxprice}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-8">
            {/* Mobile filter button */}
            <div className=" flex justify-between sm:hidden">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="flex gap-2 items-center border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <CiFilter className="h-5 w-5" />
                Filters
              </button>
              <div className=" sm:flex items-center space-x-4">
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters({ ...filters, sortBy: e.target.value })
                  }
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

            {/* Desktop filter sidebar */}
            <div className="hidden md:block w-64 flex-shrink-0">
              {
                !maxprice?(
                 <span>Loading..</span>

                ):(
                   <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                categories={categories}
                maxprice={maxprice}
              />
                  
                )
              }
              
            </div>

            {/* Main content */}
            <div className="flex-1">
              {/* Header with Category Name and Sort */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-0">
                  {categoryName}
                </h1>

                <div className="hidden sm:flex items-center space-x-4">
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters({ ...filters, sortBy: e.target.value })
                    }
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
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-gray-100 rounded-lg aspect-[3/4] animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : (
                <>
                  {products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                      {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No products found
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Try adjusting your filters or search for something else
                      </p>
                      <button
                        onClick={() =>
                          setFilters({
                            priceRange: [0, 100000],
                            ratings: null,
                            inStock: false,
                            sortBy: "popular",
                            categories: [],
                          })
                        }
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default ProductByCategory;
