import express from "express";
import { accessChat, fetchChats, fetchMessages, sendMessage } from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.route('/user/:userId')
    .get(accessChat)
    .post(sendMessage);

chatRouter.get('/me', fetchChats);

chatRouter.get('/:chatId', fetchMessages);

export default chatRouter;