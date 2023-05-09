const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser,
} = require("../controllers/users-controller");
const verifyToken = require("../middlewares/auth");

const router = express.Router();

router.get("/", verifyToken, getAllUsers);
router.post("/login", loginUser);
router.post("/signup", registerUser);
router.delete("/:uid", verifyToken, deleteUser);

module.exports = router;
