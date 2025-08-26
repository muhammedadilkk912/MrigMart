import express from "express";
import protectRoute from '../middleware/protectRoute.js'
import {wishlist,addToWishlist,deletewishlist,addToCart,getCarts,update_Cartquantity,getvalidcartitems ,getaddress,updateuser,updateAddress,
        deleteCartItem ,orders,Addrivew ,getreviews,getProduct,getDetails,logout,getAccount,updateAddress_ac,otpSend,updateProfile,delete_item_wishlist
} from '../controller/userController.js'
import {createCheckoutSession} from '../controller/PaymentController.js'
 
 
const router=express.Router()


router.get('/wishlist',protectRoute,wishlist)
router.post('/addtowishlist/:id',protectRoute,addToWishlist)
router.delete('/deletewishlist/:id',protectRoute,deletewishlist)
router.delete('/deleteItemsInWishlist/:id',protectRoute,delete_item_wishlist)
router.post('/addToCart',protectRoute,addToCart)
router.get('/getCarts',protectRoute,getCarts)
router.delete('/delete/cartitem/:id',protectRoute,deleteCartItem)

router.put('/updateCartquantity/:productId/:quantity',protectRoute,update_Cartquantity)
router.get('/getcartforcheckout',protectRoute,getvalidcartitems)
router.get('/getaddres',protectRoute,getaddress)
router.post('/updatemobile',protectRoute,updateuser)
router.post('/updateAddress',protectRoute,updateAddress)

router.post('/payment',protectRoute,createCheckoutSession)  
// router.post('/payment/confirm',protectRoute,confirmPayment)
  
router.get('/orders/:filter',protectRoute,orders)    
router.post('/addreview',protectRoute,Addrivew)
router.get('/getreviews',protectRoute,getreviews)
router.get('/getproduct/:id',protectRoute,getProduct)         
    


router.get('/details/product&address/:id',protectRoute,getDetails)
router.get('/getaccount/:filter',protectRoute,getAccount)
router.post('/account/addressupdate',protectRoute,updateAddress_ac)

router.post('/changingemail/otp',protectRoute,otpSend)
router.put('/updateprofile',protectRoute,updateProfile)

router.post('/logout',protectRoute,logout) 
export default router