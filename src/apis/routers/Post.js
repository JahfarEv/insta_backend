const router = require("express").Router();
const uploadCloudinary = require("../../middleware/multer");
const Post = require("../../model/Post");
const verifyToken = require("./verifyToken");

//create post

router.post("/new/post", uploadCloudinary, async (req, res) => {
  try {
    const { title, image } = req.body;
    console.log(title, image);

    const post = await Post.create({
      title: title,
      image: image,
      // user: req.user.id,
    });
    console.log(post);
    res.status(200).json({
      status:'sucess',
      data : post
    });
  } catch (error) {
    // Handle errors from middleware or Post.create
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;



//get post

router.get("/get-post", verifyToken, async (req, res) => {
    try {
        const post = await Post.find({});
        if(!post){
            return res.status(404).json({
                status:'error',
                messege:'post not found'
            })
        }
      
      res.status(200).json({
        status:'success',
        data:{
            post
        }
      });
    } catch (error) {
      return res.status(401).json("internal server error");
    }
  });
  
  module.exports = router;

router.post("/all/post/by/user",verifyToken,async(req,res)=>{
  try {
    const post = await Post.find({user:req.user.id});
    if(!post){
      return res.status(200).json('You have dont have a post')
    }
    return res.status(200).json(post)
  } catch (error) {
    console.log(error);
    return res.status(500).json('internal server error')
  }
})

router.put("/:id/like",verifyToken, async(req,res)=>{
  try {
    const post = await Post.findById(req.params.id)
    if(!post.likes.includes(req.user.id)){
      await post.updateOne({$push:{likes:req.user.id}})
    }
    else{
      await post.updateOne({$pull:{likes:req.user.id}})
    }
    return res.status(200).json('like')
  } catch (error) {
    console.log(error);
  }
})


router.put("/comment/post", verifyToken, async(req,res)=>{
  try {
    const {comment,postid,profile} = req.body;
    const comments = {
    user:req.user.id,
    username:req.user.username,
    profile,
    comment
    }
    const post = await Post.findById(postid);
    if(!post){
    return res.status(400).json('not found')
    }
    post.comments.push(comments);
    await post.save();
    return res.status(200).json(post)
  } catch (error) {
    console.log(error);
  }
})

  //update post

  // router.put("/edit/post/:id", verifyToken, async (req, res) => {
  //   const id = req.params
  //   try {
  //     const { title, image } = req.body;
  //     console.log(title, image);
  
  //     const editPost = await Post.findByIdAndUpdate(id,{
  //       title: title,
  //       image: image,
  //       user: req.user.id,
  //     },{new:true}).save();
  //     res.status(200).json({
  //       status:'success',
  //       dta:{
  //           editPost
  //       }
  //     });
  //   } catch (error) {
  //     return res.status(401).json("internal server error");
  //   }
  // });
  
  // module.exports = router;