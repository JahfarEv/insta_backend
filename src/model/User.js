const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password:{
      type:String,
      required:true
  },
  resetToken:String,
  expireToken:Date,
  pic:{
   type:String,
   
  },
  followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]
})
module.exports = mongoose.model("User", UserSchema);
