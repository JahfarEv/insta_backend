const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require('morgan')

const user = require("./apis/routers/User");
const post = require("./apis/routers/Post");

app.use(cors());
app.use(morgan('dev'))
app.use(express.json());
app.use("/api/user", user);
app.use("/api/post", post);

module.exports = app;
