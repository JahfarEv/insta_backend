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
      data: {
        user,
        posts,
      },
    });
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});

// follow and unfollow

router.put("/follow", requireLogin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.body.followId,
      { $push: { followers: req.user._id } },
      { new: true }
    );
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { following: req.body.followId } },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(422).json({ error: error.message });
  }
});


//un-follow

router.put('/unfollow', async (req, res) => {
  const { unfollowId } = req.body;

  try {
    // Update the user document to remove the unfollowId from the following array
    await User.findByIdAndUpdate(
      req.user._id, // Assuming req.user contains the authenticated user's data
      { $pull: { following: unfollowId } }, // Remove unfollowId from following array
      { new: true } // Return the updated user document
    );

    res.status(200).json({ message: 'Unfollow successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;
