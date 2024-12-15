import express from "express";
import { addComment, addReply, deleteComment, deleteReply, getPostComments, likeAndUnlikeComment, likeAndUnlikeReply, updateComment, updateReply } from "../controllers/postController.js";

const commentRouter = express.Router();

commentRouter.route("/:postId").post(addComment)

commentRouter.route("/:commentId")
    .put(updateComment)
    .delete(deleteComment);

commentRouter.get("/post/:postId", getPostComments);

commentRouter.post("/reply/:commentId", addReply);

commentRouter.route("/reply/:replyId")
    .put(updateReply)
    .delete(deleteReply);

commentRouter.get("/like/:commentId", likeAndUnlikeComment);

commentRouter.get("/reply/like/:replyId", likeAndUnlikeReply);


export default commentRouter;