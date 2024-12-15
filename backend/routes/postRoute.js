import express from "express";
import { createPost, deletePost, getAllPosts, getMyPosts, getPostById, getPostOfFollowing, getUserPosts, likeAndUnlikePost, saveAndUnsavePost, updatePost } from "../controllers/postController.js";
import commentRouter from "./commentRoute.js";
import { isAuthenticated } from "../middleware/auth.js";

const postRouter = express.Router();

postRouter.post("/create", isAuthenticated, createPost);

postRouter.get("/all", isAuthenticated, getAllPosts);

postRouter.get("/my", isAuthenticated, getMyPosts);

postRouter.get("/user/:id", isAuthenticated, getUserPosts);

postRouter.use("/:id", isAuthenticated)
postRouter.route("/:id")
    .get(getPostById)
    .delete(deletePost)
    .patch(updatePost)

postRouter.get("/like/:id", isAuthenticated, likeAndUnlikePost);

postRouter.get("/save/:id", isAuthenticated, saveAndUnsavePost);

postRouter.get("/following/posts", isAuthenticated, getPostOfFollowing);


// Comment Routes
postRouter.use("/comment", isAuthenticated, commentRouter);


export default postRouter;