import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
  },
  specific_fields: [
    {
      name: { type: String, required: true },
      placeholder: { type: String, required: true },
      type: { type: String, required: true },
      Options: { type: [String], default: [] },
    },
  ],
});

// ✅ Prevent model overwrite during dev hot reload
export default mongoose.models.Category || mongoose.model('Category', categorySchema);




// import mongoose from "mongoose";
// const categorySchema=new mongoose.Schema({
//     category:{
//         type:String,
//         required:true,
//         unique:true
//     },
    
//     specific_fields:[{
//         name:{type:String,required:true},
//         placeholder:{type:String,required:true},
//         type:{
//             type:String,
//             required:true
//         },
//         Options:{type:[String],default:[]}

//     }]
// })

//  export default mongoose.model('Category', categorySchema);
