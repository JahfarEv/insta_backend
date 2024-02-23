const router = require("express").Router();
const User = require("../../model/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
router.post("/new/user", async (req, res) => {
  try {
    const { email,fullname, username,password } = req.body;
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(200).json("login with correct password");
    } else {
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(password, salt);
      console.log(hash);
      user = await User.create({
        email: email,
        fullname:fullname,
        username: username,
        password: hash
        
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

module.exports = router;



