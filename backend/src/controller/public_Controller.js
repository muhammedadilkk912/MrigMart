import mongoose from 'mongoose';
import bannerModel from '../model/banner.model.js';
import categoryModel from '../model/category.model.js'
import productModel from '../model/product.model.js'

const getbanner = async (req, res) => {
    console.log("inside the get banner")
  try {
    const banner = await bannerModel.find({status:'Active'});
    console.log(banner)
   
    if (banner.length === 0) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.status(200).json({ message: "Banner retrieved", banner });
  } catch (error) {
    console.error("Error in getbanner:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getcategories = async(req,res) => {
    try {
        const category=await categoryModel.find()
        console.log(category)
        if(category.length === 0){
            return res.status(400).json({message:"category not found"})
        }
        res.status(200).json({message:'category got',category})
    } catch (error) {
        return res.status(500).json({message:"internal server error"})
    }
  // Add logic when ready   
};

const products_by_category=async(req,res)=>{
    let {id}=req.params
    id=new mongoose.Types.ObjectId(id)

    try {
//        const products = await productModel.aggregate([
//   {
//     $match: {
//       category: new mongoose.Types.ObjectId(id)  // Ensure it's an ObjectId
//     }
//   },
//   {
//     $facet: {
//       products: [
//         { $sort: { createdAt: -1 } }  // You can apply pagination/sorting here
//       ],
//       maxPrice: [
//         {
//           $group: {
//             _id: null,
//             max: { $max: "$discountprice" }
//           }
//         }
//       ]
//     }
//   },{
//       $project:{
//         products:1,
//         maxPrice:{$arrayElemAt:["$maxPrice.max",0]}
//       }
//     }
// ]); 
const products=await productModel.aggregate([
  {
    $match:{category:id}
  },
  {
  $lookup: {
    from: "reviews",         // collection to join
    localField: "_id",        // field in products collection
    foreignField: "product",  // field in reviews collection
    as: "reviews"             // alias: new field to hold matched reviews
  }
},{
  $addFields: {
    averageRating: { $avg: "$reviews.rating" }
  }
},
  // Step 4: Group all products and extract max price
{
 $group:{
  _id:null,
  maxprice:{$max:'$discountprice'},
  products:{$push:'$$ROOT'}
 }
},
//reshape the result
{
  $project:{
    _id:0,
    maxprice:1,
    products:1
  }
}
])
console.log("products=",products)
console.log("products=",products[0].products)




        if(products.length === 0){
            return res.status(400).json({message:"product not found"})
        }
        res.status(200).json({message:"product got it ",products})
    } catch (error) {
      console.log(error)
        return res.status(500).json({message:'internal server error'})
    }
}

const getproduct=async(req,res)=>{
  
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

const similiarProduct=async(req,res)=>{
  console.log("inside the similiar product");
  
  const{id,productId}=req.params
  console.log(id,productId)

  console.log(id,"=",productId)
  if(!id && !productId){
    return res.status(400).json({message:"id not found"})
  }
  try {
    // {_id:{$ne:productId},category:id}
    const products=await productModel.aggregate([  {
    $match: {
      category: new mongoose.Types.ObjectId(id),
      _id: { $ne: new mongoose.Types.ObjectId(productId) }
    }
  }
  ,{ $lookup:{
    from:'reviews',
    localField:'_id',
    foreignField:'product',
    as:'review'

  }
    
  }
  ,{
    $addFields:{
      averageRating:{$avg:"$review.rating"}
    }
  },{
    $limit:5
  }
])


    if(products.length === 0){
      return res.status(400).json({message:"products not found"})
    }
    res.status(200).json({message:"similiar product got it ",products})
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"internal server error"})
  }
}

const getfilteredPrdoucts=async(req,res)=>{
  console.log(req.params)
  const {id}=req.params
  const {minPrice,maxPrice,sortBy,inStock,ratings}=req.query
  console.log(req.query)
  
  
 
    const filter = {
      category: new mongoose.Types.ObjectId(id),
      discountprice: { $gte: Number(minPrice), $lte: Number(maxPrice) },
    };
        if (inStock === "true") {
      filter.stock = { $gt: 0 };
    }
        let sortQuery = {};
    switch (sortBy) {
      case "price-low":
        sortQuery.discountprice = 1;
        break;
      case "price-high":
        sortQuery.discountprice = -1;
        break;
     
      case "newest":
        sortQuery.createdAt = -1;
        break;
      default:
        sortQuery.sold = -1;
    }
    try {
       const pipline=[{
        $match:filter
       },{
        $lookup:{
          from:'reviews',
          localField:'_id',
          foreignField:'product',
          as:'reviews'
        }
       },{
  $addFields: {
    averageRating: { $avg: "$reviews.rating" },
    roundedRating: { $floor: { $avg: "$reviews.rating" } }
  }
},]

let rating
if(ratings!=='null'){
  // console.log("inside the chekcing")
  rating=JSON.parse(ratings)
}
if(Array.isArray(rating)&& rating.length>0){
  console.log("inside the ratings")
  pipline.push({
    $match:{
      roundedRating:{$in:rating}
    }
  })

}
console.log(ratings,rating,pipline)


 pipline.push({ $sort: sortQuery });
const products=await productModel.aggregate(pipline)
 console.log("products=",products)

    if(products.length===0){
      return res.status(400).json({message:'fitered product not found'})
    }
    res.status(200).json({message:'filtered product got it',products})
  // console.log(req.query)
    } catch (error) {
      console.log(error)
      res.status(500).json({message:'internal server error'})
    }
   
 
}

const searchProducts=async(req,res)=>{
  console.log("insidethe search products")
  console.log(req.query)
  const {search,min,max,sortBy,inStock,ratings,page}=req.query
  const limit=10;
  const skip=(page-1)*limit

   let sortQuery = {};
    switch (sortBy) {
      case "price-low":
        sortQuery.discountprice = 1;
        break;
      case "price-high":
        sortQuery.discountprice = -1;
        break;
     
      case "newest":
        sortQuery.createdAt = -1;
        break;
      default:
        sortQuery.sold = -1;
    }


    let matchConditions = {};
    if(search){
  matchConditions.$or=[
    {name:{$regex:search,$options:'i'}},
    {description:{$regex:search,$options:'i'}},
    {
      "category.category":{$regex:search,$options:"i"}
    }
  ]
}
if (inStock === "true") {
  matchConditions.stock = { $gt: 0 };
}

if(ratings){
  let rating=ratings.split(',').map(Number)
  console.log("inside the array",rating)
  matchConditions.roundedRating={
    $in:rating
  }

}



if (min && max) {
  matchConditions.discountprice = {
    $gte: Number(min),   
    $lte: Number(max),
  };
}
console.log(matchConditions)

 const pipeline = [
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: "$category" },
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'product',
        as: 'reviews'
      }
    },
    {
      $addFields: {
        averageRating: { $avg: "$reviews.rating" },
        roundedRating: { $floor: { $avg: "$reviews.rating" } },
      }
    },
    
    ...(Object.keys(matchConditions).length > 0 ? [{ $match: matchConditions }] : []),
    {
      $facet: {
        products: [
          { $sort: sortQuery },
          { $skip: skip },
          { $limit: limit }
        ],
        totalCount: [    
          { $count: "count" }
        ]
      }
       }
  ];
  console.log("pipline=",pipeline)
  









// console.log("pipline",pipeline)


try {
  
  const result=await productModel.aggregate(pipeline)

  console.log("products=",result)
      const products = result[0].products;
    const totalCount = result[0].totalCount[0]?.count || 0;
    console.log(totalCount)

  const totalpage=Math.ceil(totalCount/limit)
  console.log(totalpage)
  if(products.length === 0){
    return res.status(400).json({message:'product not found'})
  }
  const maxproduct=await productModel.aggregate([
    {$match:{}},
    {$group:{_id:null,maxprice:{$max:'$discountprice'}}}
  ])
  console.log("maxprice=",maxproduct)
  const maxprice=maxproduct[0].maxprice
  console.log(maxprice)
  res.status(200).json({message:"searched products got it",products,totalpage,maxprice})
} catch (error) {
  console.log(error)
  res.status(500).json({message:'internal server error'})
}
}


const featuredproducts=async(req,res)=>{
  let  {limit}=req.params
  console.log(limit)
  
  try {
const products = await productModel.aggregate([
  {
    $match: { status: 'Active' }  // optional
  },
  {
    $lookup: {
      from: 'reviews',
      localField: '_id',
      foreignField: 'product',
      as: 'reviews'
    }
  },
  {
    $match: { 'reviews.0': { $exists: true } }  // has at least one review
  },
  {
    $addFields: {
      averageRating: { $avg: '$reviews.rating' }
    }
  },
  {
    $sort: { averageRating: -1 }
  },
  {
    $limit: Number(limit)
  },
 {
    $project: {
      reviews: 0  // 👈 Exclude only the reviews field
    }
  }
]);

    console.log(products.length)
    res.status(200).json({message:'featured product got it',products})
  } catch (error) {
    console.log(error)
    res.status(500).json({message:'internal server error'})
  }
}


const bestsellerproducts=async(req,res)=>{
  try {
    const {limit}=req.params
     const products=await productModel.aggregate([
      {
        $match:{
          status:'Active',
          stock:{$gt:0}
        }
      },{
        $lookup:{
          from:'reviews',
          localField:'_id',
          foreignField:'product',
          as:'reviews'
        }
      },{

        $addFields:{
          averateRating:{$avg:'$reviews.rating'}
        }
      },{
        $sort:{sold:-1}
      },{
        $limit:Number(limit)
      }
     ])
  
  res.status(200).json({message:'best seller products got it',products})
  } catch (error) {
    console.log(error)
    res.status(500).json({message:'internal server error',})
  }
 



}





export { getcategories,similiarProduct, getbanner,products_by_category,getproduct,getfilteredPrdoucts,
  searchProducts,featuredproducts,bestsellerproducts
 };
