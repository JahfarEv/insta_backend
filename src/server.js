const dotenv = require("dotenv");
dotenv.config({path:'./.env'})
const connectDB = require("./config/connectDB");
const apps = require("./app");
const port = 5000;
connectDB();

apps.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
