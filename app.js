const express = require("express");
const dotenv = require("dotenv");
const chatRoutes = require("./routes/chats");

const HttpError = require("./models/http-error");

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Authorization, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST PATCH DELETE");
  next();
});
app.use("/api/chats", chatRoutes);

app.listen(PORT, (err, succ) => {
  console.log(`app running on port ${PORT}`);
});

app.use((req, res, next) => {
  throw new HttpError("Could not find this route", 404);
});

app.use((error, req, res, next) => {
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occurred!" });
});
