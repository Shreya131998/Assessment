const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    
    name: { type: String, required: true, trim: true },
    user_id:{type:Number},
    Password: { type: String, required: true, trim: true },
    
    email_id: { type: String, required: true, trim: true, unique: true },
    User_name:{type:String,required:true,unique:true,trim:true},
    Gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Other"],
      },
    Mobile: { type: String, unique: true, required: true },
    
    following: { 
      type: Array 
      }, 
      followers: { 
      type: Array 
      },
    
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);