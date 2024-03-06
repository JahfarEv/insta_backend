const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const PostSchema = new mongoose.Schema(
  {
    
    title: {
      type: String,
      required:true
    },
    body:{
      type:String,
      required:true
    },
    photo:{
      type:String,
      required:true

    },
    postedBy:{
      type:ObjectId,
      ref:"User"
    },
   
    likes: [{
      type: ObjectId,
      ref:"User"
    }],
    comments: [
      {
        user: {
          type: ObjectId,
          require: true,
        },
        username: {
          type: String,
          require: true,
        },
        profile: {
          type: String,
        },
        comment: {
          type: String,
          require: true,
        },
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Post", PostSchema);
