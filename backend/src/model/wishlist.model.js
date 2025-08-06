import mongoose from "mongoose";
import userModel from './user.js'
import productModel from "./product.model.js";


const wishlistSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',  
        required:true

    },
    product:{
         type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    }
},{
    timestamps:true
})

export default mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);
