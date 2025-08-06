
import productModel from '../model/product.model.js'
import  wishlistModel from '../model/wishlist.model.js'
import cartModel from '../model/cart.model.js'
import addressModel from '../model/address.model.js' 
import userModel from '../model/user.js'
import mongoose from 'mongoose'
import otp_generator from 'otp-generator'
import orderModel from '../model/order.model.js'
import reviewModel from '../model/review.model.js'
import sendMail from '../utils/nodemailer.js'

const wishlist=async(req,res)=>{
    try {
        const wishlist=await wishlistModel.find().populate('product')
        if(wishlist.length === 0){
            return res.status(400).json({message:"nothing added in wishlist"})
        }
        res.status(200).json({message:'wishlist got it',wishlist})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"internal server error"})
        
    }

}
const addToWishlist=async(req,res)=>{
    const{id}=req.params
    if(!id){
        return res.status(400).json({message:'product id not found'})
    }
    try {
        const product=await productModel.findById(id)
        if(!product){
            return res.status(400).json({message:'product not found'})
        }
        const oldwishlist=await wishlistModel.findOne({product:id})
        console.log("existing wishlist=",oldwishlist)
       
        if(oldwishlist){  
            return res.status(201).json({message:'already added'})
        }
        
        const wishlist=new wishlistModel({
            product:id,
            user:req?.user?.id
        })
        await wishlist.save()
        res.status(200).json({message:'add to wishlist'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"internal server error"})
        
    }
}

const deletewishlist=async(req,res)=>{
    const{id}=req.params
    if(!id){
        return res.status(400).json({message:"id not found"})
    }
    try {
        const wishlist=await wishlistModel.deleteOne({_id:id})
        console.log(wishlist)
        res.status(200).json({message:'item deleted successfully'})
        
    } catch (error) {
        return res.status(500).json({message:'internal server error'})
    }
}
const addToCart=async(req,res)=>{
    console.log("inside the add to cart")
    const userId = req.user.id; // use r from token
    console.log(req.body)
  const { productId } = req.body;
  console.log(userId,productId)
  try {
    const product = await productModel.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
      // Find the user's cart in MongoDB
  let cart = await cartModel.findOne({ user: userId });
 
  console.log("checking cart =",cart)

  if (cart) {
    // Check if the product is already in the cart
    const itemIndex = cart.items.findIndex(item => item.product == productId);
    console.log("item index=",itemIndex)
    
    if (itemIndex > -1) {
        if(cart.items[itemIndex].quantity<= product.stcok){
               cart.items[itemIndex].quantity += 1;
        }else{
            return res.status(400).json({ message: 'Quantity exceeds available stock' });

        }
      // Product exists in cart → update quantity
    
    } else {
       if(product.stock === 0){
         return res.status(400).json({ message: 'Product is out of stock' });
       }
      // Product not in cart → add new item
      cart.items.push({ product: productId, quantity:1 }); // add actual price here
    }
  } else {
    console.log("inside the elese")
     if(product.stock === 0){
         return res.status(400).json({ message: 'Product is out of stock' });
       }
    // User doesn't have a cart → create a new one
    cart = new cartModel({
      user: userId,
      items: [{ product: productId, quantity:1}],
    });
    console.log(cart)
  }
  console.log("final cart before updating db=",cart)

  // Save the cart
  await cart.save();
  res.json({ message: 'Added to cart' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:"internal server error"})
  }



}
const getCarts=async(req,res)=>{
    try {
        const carts=await cartModel.findOne({user:req.user.id}).populate('items.product')
        res.status(200).json({message:"cart items got it",carts})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"internal server error"})
    }
}
const update_Cartquantity=async(req,res)=>{
    
        const{productId,quantity}=req.params
        
        if(!productId  && !quantity){
            return res.status(400).json({message:'id is not found'})
        }
        try {
            const cart=await cartModel.findOne({user:req.user.id})
            const product=await productModel.findById(productId)
            if(!cart){
                return res.status(404).josn({message:'no cart account in db '})
            }
            if(!product){
                return res.status(404).json({message:'product not found'})
            }
             const itemIndex = cart.items.findIndex(item => item.product == productId);
             if(quantity>product.status){
                  return res.status(404).json({message:' quantity exceeds available stock'})
             }
             if(product.stock == 0){
                return res.status(404).json({message:"product out of stock"})
             }
             cart.items[itemIndex].quantity=quantity
             await cart.save()
             let item=cart.items[itemIndex]
             res.status(200).json({message:'increase product quantity',item})

            console.log("item index=",itemIndex)
        } catch (error) {
            console.log(error)
            res.status(500).json({message:'inernal server error'})
        }
    
}
const getvalidcartitems=()=>{

}
const getaddress=async(req,res)=>{
    try {
        const address=await addressModel.findOne({user:req.user.id})
        
        const user=await userModel.findOne({_id:req.user.id},{phone:1})
        console.log(address,user)
        res.status(200).json({messagee:"got it",address,phone:user.phone})
    } catch (error) {
        return res.status(500).json({message:'internal server error'})
    }
}
const updateuser=async(req,res)=>{
   
     const {mobile}=req.body;
     console.log("inside the update user",req.body)
    if(!mobile ){
        return res.status(400).josn({message:'mobile not got it'})
    }
    try {
        const user=await userModel.updateOne({_id:req.user.id},{
            $set:{phone:mobile}},{new:true}
        )
        console.log("user=",user)
        res.status(200).json({message:'update mobile',mobile:user.phone})   
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"internal server error "})  
    }
}
const updateAddress = async (req, res) => {
 
  const { address } = req.body;
  

  try {
    const oldAddress = await addressModel.findOne({ user: req.user.id });
    console.log("old address street=",address?.city)

    if (oldAddress) {
      oldAddress.street = address.street;
      oldAddress.city = address.city;
      oldAddress.district = address.district;
      oldAddress.state = address.state;
      oldAddress.pin = address.pin;
      oldAddress.country = address.country;

      await oldAddress.save();
    } else {
      const newAddress = new addressModel({
        user: req.user.id,
        street: address.street,   
        city: address.city,
        district: address.district,
        state: address.state,
        pin: address.pin,
        country: address.country,
      });

      await newAddress.save();
    }

    res.status(200).json({ message: "Address updated successfully" });
  } catch (error) {
    console.error("Stripe session error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const deleteCartItem=async(req,res)=>{
    let {id}=req.params
    console.log("delete item in cart",id)
    if(!id){
        return res.status(400).json({message:'id not found'})
    }
     id = new mongoose.Types.ObjectId(id);
     console.log(id)
    try {
        const cart=await cartModel.updateOne({user:req.user.id},{$pull:{items:{product:id}}})
        console.log("cart items",cart)
        if(!cart){
            return res.status(400).json({message:'not cart found'})
        }
        console.log("response after updating cart")
       res.status(200).json({message:'deleted successfully'})
    } catch (error) {
        console.log(error)
  res.status(500).json({message:'internal server error'})
    }
}

const orders=async(req,res)=>{
    console.log("inside the orders")
    const {filter}=req.params
    console.log(filter)
    let query={user:req.user.id}
    if(filter==='pending'){
        
        query['items.products.status']='pending'

    }else if(filter==='shipped'){
         query['items.products.status']='shipped'
    }else if(filter === 'delivered'){
        ch='delivered'
    }else if(filter === 'cancelled'){
         query['items.products.status']='cancelled'
    }
    console.log("query",query)
    
    
    try {
        const orders=await orderModel.find(query).populate('items.products.productId')
        console.log(orders)
        if(orders.lenght===0){
            return res.status(400).json({message:'no orders found'})
        }
        res.status(200).json({message:"orders got it",orders})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'internal server error'})
    }
}

const Addrivew=async(req,res)=>{
    const {reviewText,rating,productId,orderId}=req.body
    if(!reviewText || !rating || !productId || !orderId){
        return res.status(400).json({message:'all fields are required'})
    }
    console.log(reviewText,rating,productId)
     
   
    try {
//         const indexes = await mongoose.connection.collection('reviews').getIndexes();  //remove old pattern
// console.log("index=",indexes);
// await mongoose.connection.collection('reviews').dropIndex('product_1_user_1');


        const review=await reviewModel.find({user:req.user.id,product:productId,order:orderId})
        console.log("old Review=",review)
        if(review.length > 0){
            return res.status(400).json({message:"already added"})
        }

        const newReview=new reviewModel({
            product:productId,
            order:orderId,
            user:req.user.id,
            rating:rating,
            comment:reviewText,
            status:'visible'
        })
        // return null
        await newReview.save()
        res.status(200).json({message:'review added'})

    } catch (error) {
        console.log(error)
        res.status(500).json({message:'internal server errror'})
    }
}

const getreviews=async(req,res)=>{
    console.log("inside the get reviews")
   
    console.log(req.query)
    let  filters=req.query.filters
    filters=JSON.parse(filters)
    console.log(filters)
    
    let query={
        $or:filters.map((data)=>(
            {
                product:data.productId,
                order:data.orderId
            }
        ))
    }
    
    query.user=req.user.id
    console.log("query=",query)
    // return null
    
   
       if(filters.length === 0){
        return res.status(400).json({message:'review filters  not found'})
    }
    try {
        const reviews = await reviewModel.find(query);
  if(reviews.length === 0){
    return res.status(400).json({message:"no review found"})
  }
  console.log("review are =",reviews)  

   const reviewedMap=reviews.map((val)=>(
    {
        productId:val.product,
        orderId:val.order
    }
   ))
  console.log(reviewedMap)
  res.status(200).json({reviewedMap})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"internal server error"})
    }
}
const getProduct=async(req,res)=>{
     const{id}=req.params
    console.log(id)
    if(!id){
      return res.status(400).json({message:'id not found'})
    }
    try {
      
      const product=await productModel.findById(id).populate('category','category')
      console.log("product=",product)
      if(!product){
        return res.status(400).json({message:'product not found'})
      }
      res.status(200).json({message:'product got it',product})
    } catch (error) {
      console.log(error)
      res.status(500).json({message:"internal server error"})
    }
}

const getDetails=async(req,res)=>{
    console.log("inside the get details")
    const{id}=req.params
    if(!id){
        return res.status(400).json({message:"id not found"})

    }
    try {
        
         
        const product=await productModel.findById(id).populate('category','category')
        if(!product){
            return res.status(400).json({message:'product not found'})
        }
        const address=await addressModel.findOne({user:req.user.id})
        
        const user=await userModel.findOne({_id:req.user.id},{phone:1,_id:0})
        res.status(200).json({message:'product and address got it',product,address,user})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'internal server error'})
    }
}
const getReviews=async(req,res)=>{
    const {id}=req.params
    if(!id){
        return res.status(400).json({message:'id not found'})
    }
    try {
        const reviews=await reviewModel.find({product:id}).populate('user')
        if(reviews.length === 0){
            return res.status(400).json({message:'there is no review added '})
        }
        res.status(200).json({message:"reivews got it",reviews})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'internal server error'})
    }
}

const logout=async(req,res)=>{
    console.log(req.user)

    res.clearCookie("token", {
    httpOnly: true,
    secure: true, // must match cookie options from login
    sameSite: "strict", // must match
    path: "/", // must match
  });
  res.status(200).json({message:'logout successfull'})
}

const getAccount=async(req,res)=>{
    const {filter}=req.params
    let data
    try {
        if(filter=== 'profile'){
             data=await userModel.findOne({_id:req.user.id})
        }
        if(filter === 'address'){
            data=await addressModel.findOne({user:req.user.id})
        }
        res.status(200).json({message:'profile got it ',data})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'internal server error'})
    }
}
const updateAddress_ac=async(req,res)=>{
    console.log("inside the updte address")
    console.log(req.body)
   let {street,city,district,state,country,pin}=req.body

   try {
    const address= new addressModel({
       
            user:req.user.id,
            street,
            city,
            district,
            state,
            country,
            pin
       
    })
    address.save()
    console.log(address)
    res.status(200).json({message:'updated successfully'})
   } catch (error) {
    console.log("errror",error)
    res.status(500).json({message:'internal server error'})
   }
}
const otpSend=async(req,res)=>{
    try {
        // console.log(req.body)
        const{email}=req.body
        // return null
        const user=await userModel.findOne({_id:req.user.id})
        if(!user){
            
            res.status(400).json({message:'user not found'})
        }
        let otp=otp_generator.generate(4,{ upperCaseAlphabets: false,lowerCaseAlphabets:false, specialChars: false });
        user.otp=otp
         user.otpExpire=new Date(Date.now()+5*60000);
        let text=`<p>verification OTP : <Strong>${otp}</Strong></p>`
        await sendMail(email,'OTP for verification',text)
        await user.save()
        res.status(200).json({message:'otp sented your entered email'})

    } catch (error) {
        console.log(error)
        res.status(500).json({message:'internal server error'})
    }
}
const updateProfile=async(req,res)=>{
    console.log(req.body)
    const {code,user}=req.body
    try {
        if(code){
            const userDetails=await userModel.findOne({_id:req.user.id})
        console.log(userDetails)
        if(!userDetails){
            res.status(400).json({message:'user not found'})
        }
        if(userDetails.otp !== code){
             return res.status(400).json({message:'otp not corredt'})
        }
        if(new Date() > userDetails.otpExpire){
            return res.status(400).json({message:'time is expired ,try again'})
        }
        userDetails.email=user.email,     
        userDetails.username=user.name,
        userDetails.otp=null,
        userDetails.otpExpire=null,
        userDetails.phone=user.phone      
        await userDetails.save()
        }else {
            const updateuser=await userModel.updateOne({_id:req.user.id},{
                $set:{
                    username:user.name,
                    phone:user.phone
                }
            })
            console.log(updateuser)
        }
       
        res.status(200).json({message:'updated successfully'})
    } catch (error) {
        
        console.log(error)
        res.status(500).json({message:'internal server error'})
    }

}

export{wishlist,addToWishlist,deletewishlist,deleteCartItem ,updateAddress,addToCart,getCarts ,update_Cartquantity,getvalidcartitems,getaddress,
    updateuser,orders,Addrivew,getreviews,getProduct,getDetails,getReviews,logout,getAccount,updateAddress_ac,otpSend,updateProfile } 

