const mongoose = require('mongoose');
const dotenv = require('dotenv')
const path = require('path')
dotenv.config({path: path.join(__dirname,'config.env')})

const connectDB = async ()=>{
    try {
     await mongoose.connect(process.env.MONGODB_URI)
     console.log('connect sucessfull');
    } catch (error) {
     console.error(error)
    }
 
 }
 module.exports = connectDB