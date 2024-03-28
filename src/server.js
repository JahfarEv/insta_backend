const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const connectDB = require("./config/connectDB");
const apps = require("./app");
const PORT = process.env.PORT || 5000;
connectDB();

apps.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});
