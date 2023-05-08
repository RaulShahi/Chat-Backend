const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const chatRoutes = require("./routes/chats");
const userRoutes = require("./routes/user-routes");

const HttpError = require("./models/http-error");

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

mongoose
  .connect(`${process.env.MONGO_URI}`)
  .then(() => {
    app.listen(PORT, (err, succ) => {
      console.log(`connected to db. app running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));

app.use("/api/users", userRoutes);

app.use("/api/chats", chatRoutes);

app.use((req, res, next) => {
  return next(new HttpError("Could not find this route", 404));
});

app.use((error, req, res, next) => {
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occurred!" });
});
