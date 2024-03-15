const router = require("express").Router();
const User = require("../../model/User");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const Post = require("../../model/Post");
const requireLogin = require("../../middleware/requireLogin");

router.get("/protected", requireLogin, (req, res) => {
  res.send("hello");
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(422).json({ error: "Please add all the fields" });
    }

    const savedUser = await User.findOne({ email: email });

    if (savedUser) {
      return res
        .status(422)
        .json({ error: "User already exists with that email" });
    }

    const hashedpassword = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      password: hashedpassword,
      name,
    });

    await user.save();
    res.json({ message: "Saved successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ error: "Please add email or password" });
    }

    const savedUser = await User.findOne({ email: email });

    if (!savedUser) {
      return res.status(422).json({ error: "invalid email or password" });
    }

    const doMatch = await bcrypt.compare(password, savedUser.password);

    if (doMatch) {
      // res.json({ message: 'successfully signed in' });
      const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SCT);
      const { _id, name, email } = savedUser;
      res.json({ token, user: { _id, name, email } });
    } else {
      return res.status(422).json({ error: "invalid email or password" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//user with google

router.post("/new/google-user", requireLogin, async (req, res) => {
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
router.get("/allusers", requireLogin, async (req, res) => {
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
router.get("/profile", async (req, res) => {
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


module.exports = router;
