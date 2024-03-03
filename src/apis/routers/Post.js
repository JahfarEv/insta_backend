const router = require("express").Router();
const uploadCloudinary = require("../../middleware/multer");
const Post = require("../../model/Post");
const verifyToken = require("./verifyToken");

//create post

router.post("/new/post", uploadCloudinary, async (req, res) => {
  try {
    const { userId, title, image } = req.body;

    const post = await Post.create({
      title: title,
      image: image,
      user: userId,
    });

    res.status(201).json({
      status: "sucess",
      data: post,
    });
  } catch (error) {
    // Handle errors from middleware or Post.create
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

//get post

router.get("/get-post", async (req, res) => {
  try {
    const post = await Post.find().populate("user");
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

module.exports = router;

router.get("/all/post/byuser/:id", verifyToken, async (req, res) => {
  try {
    const userPostId = req.params.id;
    const post = await Post.findById(userPostId);
    if (!post) {
      return res.status(400).json("You have dont have a post");
    }
    
    return res.status(200).json({
      status: "success",
      data: post,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json("internal server error");
  }
});

router.put('/likes/:id',async (req,res)=>{
  try {
      const postId=req.params.id;
      const {userId}=req.body;
      const post=await Post.findById(postId);
      if(!post)return res.status(404).json({error:'post not found'})
      const likedpost=post.likes.includes(userId)
  if(likedpost){
      await Post.updateOne({_id:postId},{$pull:{likes:userId}})
      res.status(200).json({message:'post unliked successfully'})
  }else{
      post.likes.push(userId);
      await post.save();
      res.status(200).json({ message: "Post Like succesfully" });
  }
  } catch (error) {
      console.error(error,'err,like')
      res.status(500).json({error:'internal server error'})
  }
}
)
router.put("/comment/post", async (req, res) => {
  try {
    const { comment, postid, profile } = req.body;
    const comments = {
      user: req.user.id,
      username: req.user.username,
      profile,
      comment,
    };
    const post = await Post.findById(postid);
    if (!post) {
      return res.status(400).json("not found");
    }
    post.comments.push(comments);
    await post.save();
    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
  }
});

//update post

router.put("/edit/post/:id",  async (req, res) => {
  // try {
    const { userId,title, image } = req.body;
    const  postId  = req.params.id;
    console.log(postId,'fghjk')
    console.log(title, image,userId);

    const editPost = await Post.findByIdAndUpdate(
      {_id:postId},
      {
       title,
      image,
      user:userId,
      },
      { new: true }
    );
    if(!editPost){
      return res.status(404).json({error:'post not found'})
    }
    res.status(200).json({
      status: "success",
      data: {
        editPost,
      },
    });
  // } catch (error) {
  //   return res.status(401).json("internal server error");
  // }
});

module.exports = router;
