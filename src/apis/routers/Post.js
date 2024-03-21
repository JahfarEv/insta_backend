const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const uploadCloudinary = require("../../middleware/multer");
const requireLogin = require("../../middleware/requireLogin");
const Post = require("../../model/Post");


//create post

router.post("/new/post", requireLogin, async (req, res) => {
  try {
    const { title, body, pic } = req.body;
    console.log(title, body, pic);
    if (!title || !body || !pic) {
      return res.status(422).json({ error: "Please add all the fields" });
    }

    // req.user.password = undefined;

    const post = new Post({
      title,
      body,
      photo: pic,
      postedBy: req.user,
    });

    const result = await post.save();
    res.json({ post: result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



//get post

router.get("/allpost", requireLogin, async (req, res) => {
  try {
    const post = await Post.find().sort({createdAt:-1}).populate("postedBy", "_id name")
    .populate("comments.postedBy","_id name pic")
    if (!post) {
      return res.status(404).json({
        status: "error",
        messege: "post not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: post,
    });
  } catch (error) {
    return res.status(401).json("internal server error");
  }
});



//get post specific user

router.get("/mypost", requireLogin, async (req, res) => {
  try {
    Post.find({ postedBy: req.user._id })
      .populate("postedBy", "_id name")
      .then((mypost) => {
        res.json({ mypost });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/postby/:id", requireLogin, async (req, res) => {
  const postId = req.params.id
 
  try {
    Post.findOne({ _id:postId })
      .populate("postedBy", "_id name")
      .then((postbyid) => {
        res.json({ postbyid });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//likes and unlike

router.put('/like/:id',requireLogin,async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId,name } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const likedPost = post.likes.includes(userId);

    if (likedPost) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      post.likes.push(userId);
      await post.save();
      // Create notification
    //   const notification = new Notification({
    //     senderUserId: userId,
    //     reciveUserId: post.postById,
    //     postId: postId,
    //     type: 'like',
    //     description: `${name} liked your post.`,
    //   });
    //   await notification.save();
    //   res.status(200).json({ message: "Post liked successfully" });
    // }
  
  } 
}catch (error) {
    console.error(error, "Error liking/unliking post");
    res.status(500).json({ error: "Internal server error" });
  }
}
)
router.put('/unlike/:id',requireLogin, async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const likedPost = post.likes.includes(userId);

    if (!likedPost) {
      return res
        .status(400)
        .json({ error: "Post has not been liked by this user" });
    }

    await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
    // Create notification
   
    res.status(200).json({ message: "Post unliked successfully" });
  } catch (error) {
    console.error(error, "Error unliking post");
    res.status(500).json({ error: "Internal server error" });
  }
}

)
// router.put("/like", requireLogin, (req, res) => {
  
//   Post.findByIdAndUpdate(
//     req.body.postId,
//     { $push: { likes: req.user._id } },
//     { new: true }
//   )
//     .then(result => {
//       res.json(result);
//     })
//     .catch(err => {
//       res.status(422).json({ error: err });
//     });
// });


// router.put("/unlike", requireLogin, (req, res) => {
//   Post.findByIdAndUpdate(
//     req.body.postId,
//     { $pull: { likes: req.user._id } },
//     { new: true }
//   )
//     .then(result => {
//       res.json(result);
//     })
//     .catch(err => {
//       res.status(422).json({ error: err });
//     });
// });

//comments

router.put("/comment", requireLogin, async (req, res) => {
  try {
    const comment = {
      text: req.body.text,
      postedBy: req.user._id,
      
    };

    const updatedPost = await Post.findByIdAndUpdate(
      req.body.postId,
      { $push: { comments: comment } },
      { new: true }
    ).populate("comments.postedBy", "_id name")
    .populate("name")

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error(error, "add comment");
    res.status(500).json({ error: "Internal server error" });
  }
});

//get comments
router.get("/getcomments", requireLogin, async (req, res) => {
  try {
    const myposts = await Post.find({ postedBy: req.user._id })
      .populate({
        path: 'comments',
        populate: {
          path: 'postedBy',
          model: 'User' 
        }
      })
      .exec();

    res.json({ myposts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//update post

router.put("/edit/post/:id", async (req, res) => {
  // try {
  const { userId, title, image } = req.body;
  const postId = req.params.id;
  console.log(postId, "fghjk");
  console.log(title, image, userId);

  const editPost = await Post.findByIdAndUpdate(
    { _id: postId },
    {
      title,
      image,
      user: userId,
    },
    { new: true }
  );
  if (!editPost) {
    return res.status(404).json({ error: "post not found" });
  }
  res.status(200).json({
    status: "success",
    data: {
      editPost,
    },
  });
 
});

//delete post

router.delete('/deletepost/:postId', requireLogin, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete(
      { _id: req.params.postId, postedBy: req.user._id },
      { $set: { deleted: true } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ error: "Post not found or you are not authorized to delete this post" });
    }

    res.json({ message: "Post deleted successfully", deletedPost: post });
  } catch (error) {
    console.error(error, "delete post");
    res.status(500).json({ error: "Internal server error" });
  }
});



module.exports = router;
