const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    Text:String,
    files:{type:Array},
    status:{type:String,
        enum:["Public","Private"]
    
    },
    isDeleted:{type:Boolean,default:false}
  })
  module.exports=mongoose.model("Post", postSchema);