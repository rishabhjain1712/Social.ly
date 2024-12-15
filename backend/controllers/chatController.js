import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import { message } from "../utils/message.js";
import { Response } from "../utils/response.js";

export const accessChat = async (req, res) => {
    try {
        const { userId } = req.params;

        if(!userId) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        let chat = await Chat.findOne({
            members: { $all: [req.user._id, userId] },
        }).populate('members', '-password').populate('messages');

        const user = await User.findById(userId);
        const loggedInUser = await User.findById(req.user._id);

        if (!chat) {
            chat = await Chat.create({
                members: [req.user._id, userId],
                messages: [],
            });
            chat = await Chat.findById(chat._id).populate('members', '-password');

            user.chats.unshift(chat._id);
            await user.save();
        
            loggedInUser.chats.unshift(chat._id);
            await loggedInUser.save();
        }

        Response(res, 200, true, message.chatFoundMessage, chat);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const fetchChats = async (req, res) => {
    try {
        const chats = await Chat.find({
            members: { $in: [req.user._id] },
        })
            .populate('members', '-password')
            .populate({
                path: 'messages',
                options: { sort: { createdAt: -1 } }, // Latest message first
            })
            .sort({ updatedAt: -1 });

        Response(res, 200, true, message.chatsFoundMessage, chats);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

// export const sendMessage = async (req, res) => {
//     try {
//         const { content } = req.body;
//         const { chatId } = req.params;

//         if(!content || !chatId) {
//             return Response(res, 400, false, message.missingFieldsMessage);
//         }

//         const message = await Message.create({
//             sender: req.user._id,
//             content,
//             chat: chatId,
//         });

//         await Chat.findByIdAndUpdate(chatId, {
//             $push: { messages: message._id },
//         });

//         const fullMessage = await Message.findById(message._id)
//             .populate('sender', '-password')
//             .populate('chat');

//         // Emit the message to all members in the chat
//         const chat = await Chat.findById(chatId).populate('members');
//         chat.members.forEach(member => {
//             if (member._id.toString() !== req.user._id.toString()) {
//                 io.to(member._id.toString()).emit('newMessage', fullMessage);
//             }
//         });

//         Response(res, 200, true, message.messageSentMessage, fullMessage);
        
//     } catch (error) {
//         Response(res, 500, false, error.message);
//     }
// }

export const sendMessage = async (req, res) => {
    try {
        const { content } = req.body;
        const { userId } = req.params;

        if(!content || !userId) {
            return Response(res, 400, false, message.missingFieldsMessage);
        }

        let chat = await Chat.findOne({
            members: { $all: [req.user._id, userId] },
        }).populate('members', '-password').populate('messages');

        const user = await User.findById(userId);
        const sender = await User.findById(req.user._id);

        if(!chat) {
            chat = await Chat.create({
                members: [req.user._id, userId],
                messages: [],
            });

            user.chats.unshift(chat._id);
            await user.save();
        
            sender.chats.unshift(chat._id);
            await sender.save();
        }

        const newMessage = await Message.create({
            sender: req.user._id,
            content,
            chat: chat._id,
        });

        chat.messages.push(newMessage._id);
        await chat.save();        
        

        const fullMessage = await Message.findById(newMessage._id)
            .populate('sender', '-password')
            .populate('chat');

        const io = req.app.get('io');

        // Emit the message to all members in the chat
        const chats = await Chat.findById(chat._id).populate('members');
        chats.members.forEach(member => {
            if (member._id.toString() !== req.user._id.toString()) {
                io.to(member._id.toString()).emit('newMessage', fullMessage);
            }
        });

        Response(res, 200, true, message.messageSentMessage, newMessage);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const fetchMessages = async (req, res) => {
    try {
        const { chatId } = req.params;

        if(!chatId) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        const messages = await Message.find({ chat: chatId })
            .populate('sender', '-password')
            .populate('chat');

        Response(res, 200, true, message.messagesFoundMessage, messages);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}