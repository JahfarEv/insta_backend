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
const requireLogin = require('../../middleware/requireLogin')


router.get('/protected',requireLogin,(req,res)=>{
  res.send('hello')
})
//user sign up

// router.post("/new/user", async (req, res) => {
//   try {
//     const { email, fullname, username, password } = req.body;
//     let user = await User.findOne({ email: req.body.email });
//     if (user) {
//       return res.status(200).json("login with correct password");
//     } else {
//       const salt = bcrypt.genSaltSync(saltRounds);
//       const hash = bcrypt.hashSync(password, salt);
//       user = await User.create({
//         email: email,
//         fullname: fullname,
//         username: username,
//         password: hash,
//       });
//       const accessToken = jwt.sign(
//         {
//           id: user._id,
//           username: user.username,
//         },
//         process.env.JWT_SCT
//       );
//       res.status(200).json({ user, accessToken });
//     }
//   } catch (error) {
//     return res.status(400).json("internal server error");
//   }
// });

// module.exports = router;

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(422).json({ error: "Please add all the fields" });
    }

    const savedUser = await User.findOne({ email: email });

    if (savedUser) {
      return res.status(422).json({ error: "User already exists with that email" });
    }

    const hashedpassword = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      password: hashedpassword,
      name
    });

    await user.save();
    res.json({ message: 'Saved successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



//user login

// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       res.status(400).json({
//         status: "error",
//         message: "Please provide email and password!",
//       });
//     }
//     let user = await User.findOne({ email }).select("+password");
//     if (user) {
//       const comparePassword = await bcrypt.compare(
//         req.body.password,
//         user.password
//       );
//       if (!comparePassword) {
//         return res.status(200).json("Password incorrect");
//       }
//       const accessToken = jwt.sign(
//         {
//           id: user._id,
//           name: user.name,
//         },
//         process.env.JWT_SCT
//       );

//       const { password, ...others } = user._doc;
//       return res.status(200).json({ others, accessToken });
//     }
//   } catch (error) {
//     return res.status(400).json("internal server error");
//   }
// });

// module.exports = router;

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ error: 'Please add email or password' });
    }

    const savedUser = await User.findOne({ email: email });

    if (!savedUser) {
      return res.status(422).json({ error: 'invalid email or password' });
    }

    const doMatch = await bcrypt.compare(password, savedUser.password);

    if (doMatch) {
      // res.json({ message: 'successfully signed in' });
      const token = jwt.sign({_id:savedUser._id},
         process.env.JWT_SCT)
         const {_id,name,email} = savedUser
        res.json({token,user:{_id,name,email}})
    } else {
      return res.status(422).json({ error: 'invalid email or password' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



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

//all users
router.get("/allusers", async (req, res) => {
  try {
    const users = await User.find();
    if (!users) return res.status(404).json({ error: "users not found" });
    res.status(200).json({
      message: "success",
      users: users,
    });
  } catch (error) {
    console.log(error);
  }
});

//get user by id

router.get("/userbyid/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "user not found" });
    res.status(200).json({
      message: "success",
      user: user,
    });
  } catch (error) {
    console.error(error, "get user");
    res.status(500).json({ error: "internal server error" });
  }
});

//profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const { user } = req;
    const posts = await Post.find({ user: user._id }).populate(
      "user",
      "username"
    );
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).send(error);
  }
});
//follow and unfollow

// router.put("/:id/follow", async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const followId = req.body;

//       const user = await User.findById(userId);
//       const otherUser = await User.findById(followId);

//      if(!user || !otherUser) return res.status(404).json({error:'user not found'})

//      const
//         await user.updateOne({ $push: { following: req.body.user } });
//         await otherUser.updateOne({ $push: { followers: req.params.id } });
//         return res.status(200).json("user has follow");

//         await user.updateOne({ $pull: { following: req.body.user } });
//         await otherUser.updateOne({ $pull: { followers: req.params.id } });
//         return res.status(200).json("user has unfollow");

//     }
//   } catch (error) {
//     return res.status(500).json("server error");
//   }
// });

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
router.get("/all/user/:id", verifyToken, async (req, res) => {
  try {
    const allUser = await User.find();
    const user = await User.findById(req.params.id);
    const followinguser = await Promise.all(
      user.following.map((item) => {
        return item;
      })
    );
    let userToFollow = allUser.filter((val) => {
      return !followinguser.find((item) => {
        return val._id.toString() === item;
      });
    });

    let filterUser = await Promise.all(
      userToFollow.map((item) => {
        const { email, followers, following, password, ...others } = item._doc;
        return others;
      })
    );
    res.status(200).status(filterUser);
  } catch (error) {}
});

module.exports = router;
