const express = require("express");
const dotenv = require("dotenv");
const chatRoutes = require("./routes/chats");

const app = express();
dotenv.config();
app.use("/", chatRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err, succ) => {
  console.log(`app running on port ${PORT}`);
});
