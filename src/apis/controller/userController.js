const User = require('../../model/User')
const jwt = require('jsonwebtoken')


const signToken = (id) => {
    return jwt.sign({ id, isAdmin: false }, process.env.SECRET_STR, {
      expiresIn: process.env.LOGIN_EXPIRES,
    });
  };
  exports.signup = asyncErrorHandler(async (req, res) => {
    const newUser = await User.create(req.body);
  
    res.status(201).json({
      status: "sucess",
      data: {
        user: newUser,
      },
    });
  });
  