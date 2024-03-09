const mongoose = require("mongoose");
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
  followers:[{type: mongoose.Schema.Types.ObjectId,
    ref: "User",}],
  following:[{type: mongoose.Schema.Types.ObjectId,
    ref: "User",}]
})
module.exports = mongoose.model("User", UserSchema);
