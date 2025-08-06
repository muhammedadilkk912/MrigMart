import mongoose from 'mongoose'
import Category from './category.model.js'  
import seller from './seller.model.js'

const productSchema=new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  discount:{type:Number},
  discountprice: { type: Number, default: 0 },
  images: [{ type: String },], // URLs of uploaded images
  status: { type: String, enum: ["Active", "Inactive","Out of stock","suspend"], default: "Active" },
   stock: {
    type: Number,
    default: 1
  },
  sold:{
    type:Number,
    default:0
  },
 category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
 core_details: {
    type: mongoose.Schema.Types.Mixed,
    //of: String, // or of:  if values can be numbers, dates, etc.
    default: {}
  },
  isAdmin:{
    type:Boolean,
    default:false 
  },
  addedBY: { type: mongoose.Schema.Types.ObjectId, ref: 'seller'}, // Reference to the seller who added the product
},{
    timestamps:true  
  })
 export default mongoose.models.Product || mongoose.model('Product', productSchema);

 