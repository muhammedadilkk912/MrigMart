import { useState } from 'react';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi';
import Alert from './alert';
import { useSelector,useDispatch } from 'react-redux';
import { RiUser3Line } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import {setLogout} from '../Redux/AuthSlic'


import {setSearch} from '../Redux/SearchSlic'


const Header = () => {
  const dispatch=useDispatch()
  const loca=useLocation()
  // const {q}=useParams()
  const isauthenticate=useSelector((state)=>state.auth.isAuthenticate)
  const searchnew=useSelector((state)=>state.search.search)
  console.log("search=",searchnew)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
const [searchText, setSearchText] = useState('');
  const location = useLocation();
  const [logout_Cl,setLogout_Cl]=useState(false)
  const navigate=useNavigate()
  let path=location.pathname
  console.log("path name",)
  let url
    const shouldHideSearch = [
    '/checkout',
    
  ].includes(location.pathname) || path.startsWith('/direct_checkou') 
  console.log(shouldHideSearch)

 
    const pattern = /^\/category_product\/[a-fA-F0-9]{24}$/;
     let newlocation =location.pathname.match(pattern)

  const geturl=()=>{
    console.log("inside the get url fn")
  
      url=location.pathname
     
     console.log("new locaation=",newlocation)
    if(!newlocation){
      console.log("inside the new location")
      return true
    }else{
      console.log("inside the lese")
      return false
    }
   
  }

  console.log("authentication status=",isauthenticate)

  const handleSearch=(e)=>{
    // console.log("inside th e handle search",search)
  //  e.preventDefault()
   const trimmed = searchText.trim(); // remove spaces
   if (!trimmed) return;
     setIsMenuOpen(false);
  setIsSearchOpen(false);

  //  const loca= location.pathname
  //  console.log("new search=",q)

  //  dispatch(setSearch('kk'))
   
  //  let check= geturl()
  //  if(!check) return
   console.log("inside")
   navigate(`/searchproducts?q=${encodeURIComponent(searchText)}`)
  }


  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);


  const handlelogout=(val)=>{
    // toggleDropdown()
    // console.log("val=",val)
    // console.log("url=",path)
    let allowedUrl=['category_product','product']
    const cleanPath = path.split('/')
    // console.log("clean path=",cleanPath)

    
    // navigate('/')
   
    
    if(val){
      dispatch(setLogout())
       

     if(path === '/' || allowedUrl.includes(cleanPath[1])){
      setLogout_Cl(false)
    }else{
      navigate('/')
      setLogout_Cl(false) 
    }
       
    }else{
      console.log("elese")
        setLogout_Cl(false)
    }
   
    
    

  }
  const handleKeyDown=(e)=>{  
    if (e.key === 'Enter') {
    handleSearch();
  }
  }

  return (
   
    <header className="bg-white shadow-md w-full  fixed  z-50">
      <div className="container mx-auto px-4">
        {/* Mobile Top Bar */}
        <div className="flex items-center justify-between py-3 md:hidden">
          {/* Logo */}
          <NavLink to="/" className="text-xl font-bold text-blue-600">
            MrigMart
          </NavLink>

          {/* Mobile Icons */}
          <div className="flex items-center space-x-4">
            <button onClick={toggleSearch} className="text-gray-600">
              {isSearchOpen ? <FiX size={20} /> : <FiSearch size={20} />}
            </button>
            {
              !isauthenticate ? (
                <button
                onClick={()=>navigate('/login')}
                className='flex rounded-md items-center font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 ease-in-out dark:from-gray-800
                 dark:to-gray-900 text-sm px-1 py-1 gap-1 justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                >
                  <RiUser3Line className="text-sm" />
                  Login

                </button>
              ):(
                 <button onClick={toggleMenu} className="text-gray-600">
              {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>

              )
            }
           
          </div>
        </div>

        {/* Mobile Search (only shown when toggled) */}
        {isSearchOpen && (
          <div className="md:hidden py-2">
            <div className="relative">
              <input
                type="text"
                value={searchText}
                placeholder="Search products..."
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={handleKeyDown}
               
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button  onClick={handleSearch} className="absolute right-3 top-2.5 text-gray-500">
                <FiSearch size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between py-3">
          {/* Left Section - Logo */}
          <div className="w-1/4">
            <NavLink to="/" className="text-2xl font-bold text-blue-600">
              MrigMart
            </NavLink>
          </div>

          {/* Middle Section - Search Bar */}
          {
            !shouldHideSearch &&(
              <div className="w-3/4 px-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={handleSearch} className="absolute right-3 top-2.5 text-gray-500">
                <FiSearch size={20} />
              </button>
            </div>
          </div>

            )
          }
          

          {/* Right Section - Navigation */}
          <div className={`w-2/4 flex items-center  justify-end space-x-6`}>
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                ` hover:text-blue-600 ${isActive ? 'text-blue-600' : 'text-gray-700'}`
              }
            >
              Home
            </NavLink>
            {
              isauthenticate && (
                <NavLink 
              to="/cart" 
              className={({ isActive }) => 
                `flex items-center text-gray-700 hover:text-blue-600 ${isActive ? 'text-blue-600' : ''}`
              }
            >
              <FiShoppingCart size={20} className="mr-1" />
              Cart
            </NavLink>

              )
            }
            
            
            
            
            <a 
              href='https://mrig-mart-seller.vercel.app/'
              target='_blank'
              className={({ isActive }) => 
                `text-gray-700 hover:text-blue-600 ${isActive ? 'text-blue-600' : ''}`
              }
            >
              Become Seller
            </a>

            {/* Dropdown */}
            {
              !isauthenticate ? (
                <button 
                onClick={()=>
                  navigate('/login')

                }
                className="flex items-center gap-2 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 ease-in-out dark:from-gray-800 dark:to-gray-900">
  <span>Login</span>
  <RiUser3Line className="text-lg" />
</button>

              ):(
                <div className="relative">
              <button 
                onClick={toggleDropdown}
                
                className="text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                <BsThreeDotsVertical  size={20} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <NavLink 
                    to={isauthenticate? "/account"  : "/login"}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={toggleDropdown}
                  >
                    My Account
                  </NavLink>
                  <NavLink 
                    to="/orders" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={toggleDropdown}
                  >
                    My Orders
                  </NavLink>
                  <NavLink 
                    to="/wishlist" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={toggleDropdown}
                  >
                    Wishlist
                  </NavLink>
                  <div className="border-t border-gray-200"></div>
                  
                      <button 
                   
                    className=" w-full text-left px-4    py-2 text-red-500 hover:bg-gray-100"
                    onClick={()=>{
                      toggleDropdown(),
                      setLogout_Cl(true)
                    }}
                  >
                    Logout
                  </button>

                    
                     
                  
                </div>
              )}
            </div>

              )
            }
            
          </div>
        </div>

        {/* Mobile Menu (only shown when toggled) */}
        {isMenuOpen && (
          <div className="md:hidden py-2 border-t">
            <nav className="flex flex-col space-y-3">
              <NavLink 
                to="/" 
                onClick={toggleMenu}
                className={({ isActive }) => 
                  `px-3 py-2 ${isActive ? 'text-blue-600 font-medium' : 'text-gray-700'}`
                }
              >
                Home
              </NavLink>
              {
                isauthenticate &&(
                  <NavLink 
                to="/cart" 
                onClick={toggleMenu}
                className={({ isActive }) => 
                  `px-3 py-2 flex items-center ${isActive ? 'text-blue-600 font-medium' : 'text-gray-700'}`
                }
              >
                {/* <FiShoppingCart size={18} className="mr-2" /> */}
                Cart
              </NavLink>
                  
                )
              }
              
              
              
              <a 
              href='https://mrig-mart-seller.vercel.app/'
              target='_blank'
                className={({ isActive }) => 
                  `px-3 py-2 ${isActive ? 'text-blue-600 font-medium' : 'text-gray-700'}`
                }
              >
                Become Seller
              </a>
              
              {/* <div className="mt-2 ml-6 bg-gray-50 rounded-md py-1"> */}
                    <NavLink 
                      to="/account" 
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        toggleDropdown();
                        toggleMenu();
                      }}
                    >
                      Profile
                    </NavLink>
                    <NavLink 
                      to="/orders" 
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        toggleDropdown();
                        toggleMenu();
                      }}
                    >
                      Orders
                    </NavLink>
                    <NavLink 
                      to="/wishlist" 
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        toggleDropdown();
                        toggleMenu();
                      }}
                    >
                      Wishlist
                    </NavLink>
                    <div className="border-t border-gray-200 my-1"></div>
                    {
                    isauthenticate?(
                      <button 
                   
                    className=" w-full text-left px-4    py-2 text-red-500 hover:bg-gray-100"
                    onClick={()=>{
                      setIsMenuOpen(false),
                      setLogout_Cl(true)
                    }}
                  >
                    Logout
                  </button>

                    ):(
                      <NavLink
                      to='/login'
                   
                    className=" block  px-4    py-2 text-gray-700 hover:bg-gray-100"
                     >
                    Login
                  </NavLink>
                    )
                  }
                  {/* </div> */}
              

              {/* Mobile Dropdown */}
              {/* <div className="px-3 py-2">
                <button 
                  onClick={toggleDropdown}
                  className="flex items-center text-gray-700 w-full"
                >
                  <FiUser size={18} className="mr-2" />
                  My Account
                </button> */}
                
                {/* {isDropdownOpen && ( */}
                  
                {/* )} */}
              {/* </div> */}
            </nav>
          </div>
        )}
      </div>
      {
        logout_Cl&&(
          <Alert
          onConfirm={handlelogout}
          />
        )
      }
    </header>
  );
};

export default Header;