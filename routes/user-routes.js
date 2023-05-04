const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser,
} = require("../controllers/users-controller");

const router = express.Router();

router.get("/", getAllUsers);
router.post("/login", loginUser);
router.post("/signup", registerUser);
router.delete("/:uid", deleteUser);

module.exports = router;
