const express = require("express");
const verifyToken = require("../middlewares/auth");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messages-controller");

const router = express.Router();
router.use(verifyToken);
router.route("/").post(sendMessage);
router.get("/:chatId", allMessages);

module.exports = router;
