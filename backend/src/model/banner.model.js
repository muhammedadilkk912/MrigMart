import mongoose from 'mongoose'

const bannerSchema=new mongoose.Schema({
    image:{
        type:String
    },
    link:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:true
    },
    addedby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'addedbymodel',
        required:true

    },
    addedbymodel:{
        type:String,
        required:true,
        enum:['seller','admin']
    },
    status:{
        type:String,
        enum:['Active','Inactive','Pending'],
        default:'Pending'
    }
},{
    timestamps:true
})

export default mongoose.model.Banner || mongoose.model('Banner',bannerSchema)