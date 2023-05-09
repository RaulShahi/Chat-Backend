const express = require("express");
const verifyToken = require("../middlewares/auth");
const {
  fetchChats,
  createChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
} = require("../controllers/chat-controller");

const router = express.Router();

router.use(verifyToken);

router.route("/").get(fetchChats).post(createChats);
router.post("/group", createGroupChat);
router.patch("/rename", renameGroup);
router.patch("/groupremove", removeFromGroup);
router.patch("/groupadd", addToGroup);

module.exports = router;
