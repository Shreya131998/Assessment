const mongoose = require("mongoose");
const ObjectId=mongoose.Schema.Types.ObjectId
const postSchema = new mongoose.Schema(
  {
    Text:String,
    files:{type:Array},
    status:{type:String,
        enum:["Public","Private"]
    
    },
    userId:{type:ObjectId,ref:"User",required:true},
    likes:{type:Array},
    isDeleted:{type:Boolean,default:false}
  })
  module.exports=mongoose.model("Post", postSchema);