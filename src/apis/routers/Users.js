const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../../middleware/requireLogin");
const Post = mongoose.model("Post");
const User = mongoose.model("User");

router.get("/user/:id", requireLogin, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await Post.find({ postedBy: req.params.id }).populate(
      "postedBy",
      "_id name"
    );
    res.status(200).json({
      message: "success",
      data:{
        user,
        posts
      }
    });
   
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});

// follow and unfollow

router.put("/follow", async (req, res) => {
  try {
    User.findByIdAndUpdate(req.body.followId,{
      $push:({followers:req.user._id},{
        new:true
      },(err,result)=>{
        if(err){
          return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
          $push:({following:req.body.followId},{
            new:true}).then(result=>{
              res.json(result)
            }).catch(err=>{
              return res.status(422).json({error:err})
            })
        })
      })
    })
  } catch (error) {
    console.log(error);
  }
})
 
//un-follow

router.put("/unfollow", async (req, res) => {
  try {
    User.findByIdAndUpdate(req.body.unfollowId,{
      $pull:({followers:req.user._id},{
        new:true
      },(err,result)=>{
        if(err){
          return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
          $pull:({following:req.body.unfollowId},{
            new:true}).then(result=>{
              res.json(result)
            }).catch(err=>{
              return res.status(422).json({error:err})
            })
        })
      })
    })
  } catch (error) {
    console.log(error);
  }
})

module.exports = router;
