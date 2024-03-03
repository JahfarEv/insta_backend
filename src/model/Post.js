const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
    },
    image: {
      type: String,
      
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId
    }],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
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
