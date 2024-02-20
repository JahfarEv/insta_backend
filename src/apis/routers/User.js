const router = require("express").Router();
const User = require("../../model/User");
const bcrypt = require('bcrypt')
const saltRounds = 10;
const jwt = require('jsonwebtoken')
router.post("/new/user", async (req, res) => {
  try {
    const { email, password, username, profile } = req.body;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    console.log(hash);
    const user = await User.create({
      email: email,
      password: hash,
      profile: profile,
      username: username,
    });
    const accessToken = jwt.sign({
        id : user._id,
        username:user.username
    },process.env.JWT_SCT)
    res.status(200).json(user);
  } catch (error) {}
  return res.status(400).json("internal server error");
});

module.exports = router;
