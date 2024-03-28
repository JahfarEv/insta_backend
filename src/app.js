const express = require("express");
const cors = require("cors");
// const app = express();
const morgan = require("morgan");
const { app } = require("./socket/socket");

const user = require("./apis/routers/User");
const post = require("./apis/routers/Post");
const users = require("./apis/routers/Users");
const message = require("./apis/routers/Message");
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/user", user);
app.use("/api/post", post);
app.use("/api/users", users);
app.use("/api/message", message);

module.exports = app;
