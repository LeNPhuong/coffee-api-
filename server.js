const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });

mongoose
  .connect(
    "mongodb+srv://phuongproga73:AfZg5NjyulQBAs9h@caphe.bzkueu8.mongodb.net/caphe?retryWrites=true&w=majority&appName=caphe",
  )
  .then(() => {
    console.log("Connect succes");
  })
  .catch(() => {
    console.log("Connect Failed");
  });

const app = require("./app");

app.listen(process.env.PORT || 3001);
