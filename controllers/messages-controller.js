const HttpError = require("../models/http-error");
const Messages = require("../models/message-model");
const Users = require("../models/user-model");
const Chats = require("../models/chat-model");

exports.sendMessage = async (req, res, next) => {
  const { content, chatId } = req.body;
  if (!(content && chatId)) {
    return next(new HttpError("Invalid data passed into request", 400));
  }
  const newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };
  try {
    let message = await Messages.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await Users.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chats.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });
    return res.json(message).status(201);
  } catch (err) {
    return next(new HttpError(err.message, 401));
  }
};

exports.allMessages = async (req, res, next) => {
  const { chatId } = req.params;
  try {
    const messages = await Messages.find({ chat: chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    return next(new HttpError(error.message, 400));
  }
};
