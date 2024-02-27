const dotenv = require("dotenv");
dotenv.config({path:'./.env'})
const connectDB = require("./config/connectDB");
const app = require("./app");
const port = 5000;
connectDB();

app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
