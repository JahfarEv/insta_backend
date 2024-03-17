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
   default:"https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png"
   
  },
  followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]
})
module.exports = mongoose.model("User", UserSchema);
