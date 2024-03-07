const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model("User");

module.exports = async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(401).json({ error: 'You must be logged in' });
        }

        const token = authorization.replace("Bearer ", "");

        const payload = jwt.verify(token, process.env.JWT_SCT);

        if (!payload) {
            return res.status(401).json({ error: 'You must be logged in' });
        }

        const { _id } = payload;

        const userdata = await User.findById(_id);

        if (!userdata) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = userdata;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
