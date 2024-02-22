const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique:true
    },
    profile: {
      type: String,
    },
    password:{
        type:String,
        require:true
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", UserSchema);
