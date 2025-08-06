import express from "express";
import {getbanner,getcategories,products_by_category,getproduct,similiarProduct,
    getfilteredPrdoucts,searchProducts,featuredproducts,bestsellerproducts
} from '../controller/public_Controller.js'
const router=express.Router()



router.get('/getbanner',getbanner)
router.get('/categories',getcategories)
router.get('/productsbycategory/:id',products_by_category)
router.get('/filteredproducts/:id',getfilteredPrdoucts)
router.get('/getproduct/:id',getproduct)  
router.get('/SimilarProduct/:id/:productId',similiarProduct)
router.get('/searchproducts',searchProducts)  

router.get('/featuredproducts/:limit',featuredproducts)
router.get('/bestselerproducts/:limit',bestsellerproducts)



export default router