const Chats = require("../models/chat-model");
const Users = require("../models/user-model");
const HttpError = require("../models/http-error");

exports.createChats = async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    return next(new HttpError("UserId not sent with request", 400));
  }

  let isChat = await Chats.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await Users.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    return res.json({ chat: isChat[0] }).status(200);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chats.create(chatData);
      const fullChat = await Chats.findById(createdChat._id).populate(
        "users",
        "-password"
      );
      res.status(201).json({ chat: fullChat });
    } catch (err) {
      return next(new HttpError(err.message), 400);
    }
  }
};
exports.fetchChats = async (req, res, next) => {
  try {
    const userChats = await Chats.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    const foundChats = await Users.populate(userChats, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
    return res.json({ userChats: foundChats }).status(200);
  } catch (err) {
    return next(new HttpError(err.message), 400);
  }
};
exports.createGroupChat = async (req, res, next) => {
  const { name, users } = req.body;
  if (!(name && users)) {
    return next(new HttpError("Please fill all the fields.", 400));
  }

  const usersArray = JSON.parse(users);

  if (usersArray.length < 2) {
    return next(new HttpError("Atleast 3 users should be in a group"), 401);
  }

  usersArray.push(req.user._id);

  try {
    const groupChat = await Chats.create({
      chatName: name,
      users: usersArray,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });
    const fullGroupChat = await Chats.findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    return res.status(200).json({ newGroup: fullGroupChat });
  } catch (error) {
    return next(new HttpError(error.message, 401));
  }
};
exports.renameGroup = async (req, res, next) => {
  const { chatId, chatName } = req.body;

  try {
    const updatedChat = await Chats.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    return res.status(203).json({ updatedChat });
  } catch (err) {
    return next(new HttpError(err.message, 401));
  }
};
exports.addToGroup = async (req, res, next) => {
  const { userId, chatId } = req.body;

  try {
    const added = await Chats.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(203).json({ updatedChatMembers: added });
  } catch (err) {
    return next(new HttpError(err.message, 401));
  }
};
exports.removeFromGroup = async (req, res, next) => {
  const { userId, chatId } = req.body;
  try {
    const removed = await Chats.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(203).json({ updatedChatMembers: removed });
  } catch (err) {
    return next(new HttpError(err.message, 401));
  }
};
