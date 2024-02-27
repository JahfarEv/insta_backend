const router = require("express").Router();
const User = require("../../model/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const verifyToken = require("./verifyToken");
const { updateOne } = require("../../model/Post");
const Post = require("../../model/Post");

//user sign up

router.post("/new/user", async (req, res) => {
  try {
    const { email, fullname, username, password } = req.body;
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(200).json("login with correct password");
    } else {
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(password, salt);
      console.log(hash);
      user = await User.create({
        email: email,
        fullname: fullname,
        username: username,
        password: hash,
      });
      const accessToken = jwt.sign(
        {
          id: user._id,
          username: user.username,
        },
        process.env.JWT_SCT
      );
      res.status(200).json({ user, accessToken });
    }
  } catch (error) {
    return res.status(400).json("internal server error");
  }
});

module.exports = router;

//user login

router.post("/login", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      const comparePassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!comparePassword) {
        return res.status(200).json("Password incorrect");
      }
      const accessToken = jwt.sign(
        {
          id: user._id,
          username: user.username,
        },
        process.env.JWT_SCT
      );

      const { password, ...others } = user._doc;
      return res.status(200).json({ others, accessToken });
    }
  } catch (error) {
    return res.status(400).json("internal server error");
  }
});

module.exports = router;

//user with google

router.post("/new/google-user", async (req, res) => {
  try {
    const { username, email, profile } = req.body;
    let googleUser = await User.findOne({ email: req.body.email });
    if (googleUser) {
      return res.status(200).json("login with correct password");
    } else {
      googleUser = await User.create({
        username: username,
        email: email,
        profile: profile,
      });
      const accessToken = jwt.sign(
        {
          id: googleUser._id,
          username: googleUser.username,
        },
        process.env.JWT_SCT
      );
      res.status(200).json({ googleUser, accessToken });
    }
  } catch (error) {
    return res.status(400).json("internal server error");
  }
});

router.put("/:id/follow", verifyToken, async (req, res) => {
  try {
    if (req.params.id !== req.body.user) {
      const user = await User.findById(req.params.id);
      const otherUser = await User.findById(req.body.user);

      if (!user.followers.includes(req.bodu.user)) {
        await user.updateOne({ $push: { following: req.body.user } });
        await otherUser.updateOne({ $push: { followers: req.params.id } });
        return res.status(200).json("user has follow");
      } else {
        await user.updateOne({ $pull: { following: req.body.user } });
        await otherUser.updateOne({ $pull: { followers: req.params.id } });
        return res.status(200).json("user has unfollow");
      }
    }
  } catch (error) {
    return res.status(500).json("server error");
  }
});

router.get("/flw/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const followersPost = await Promise.all(
      user.following.map((item) => {
        return Post.find({ user: item });
      })
    );

    const userPost = await Post.find({ user: user._id });
    const filterProduct = userPost.concat(...followersPost);

    filterProduct.forEach((post) => {
      const postAge = new Date() - new Date(post.createdAt);
      const ageWeight = 1 - postAge / (1000 * 60 * 60 * 24);
      const likeWeight = post.likes.length / 100;
      const commentWeight = post.comments.length / 100;
      post.weight = ageWeight + likeWeight + commentWeight;
    });

    filterProduct.sort((a, b) => b.weight - a.weight);
    res.status(200).json(filterProduct);
  } catch (error) {
    return res.status(500).json("Server error");
  }
});

//get a user for follow
router.get("/all/user/:id" ,verifyToken, async(req,res)=>{
  try {
    const allUser = await User.find();
    const user = await User.findById(req.params.id);
    const followinguser = await Promise.all(
      user.following.map((item)=>{
        return item;
      })
    )
    let userToFollow = allUser.filter((val)=>{
      return !followinguser.find((item)=>{
        return val._id.toString()===item;
      })
    })

    let filterUser = await Promise.all(
      userToFollow.map((item)=>{
        const {email, followers, following, password, ...others} = item._doc;
        return others;
      })
    )
    res.status(200).status(filterUser)
  } catch (error) {
    
  }
})

module.exports = router;
