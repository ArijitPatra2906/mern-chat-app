const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const sendMesseage = asyncHandler(async (req, res) => {
    const { pic, content, chatId } = req.body;

    if (!chatId) {
        console.log("Invalid data passed into req");
        return res.sendStatus(500)
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
        pic: pic
    };

    try {
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "name pic")
        message = await message.populate("chat")
        message = await message.populate("pic")
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message
        })
        res.json(message)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
});

const allMessages = asyncHandler(async (req, res) => {
    try {
        const message = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name pic email").populate("chat")
        res.json(message)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})
module.exports = { sendMesseage, allMessages }