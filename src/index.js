const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose');
const port = 5000;
const user = require('./apis/routers/User')
const post = require('./apis/routers/Post')

const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log("DB connected")
}).catch((error)=>{
    console.log(error);
})

app.use(cors())
app.use(express.json())
app.use("/api/user",user);
app.use("/api/post",post)


app.listen(port, ()=>{
    console.log(`server is running at port ${port}`);
})

