import { configureStore } from "@reduxjs/toolkit";
import { contactUsReducer, followAndUnfollowUserReducer, getAllOtherUsers, getMyProfileReducer, getUserReducer, myNotificationsReducer, updateUserReducer, userAuthReducer } from "./Reducers/userReducer";
import { createPostReducer, deletePostReducer, getAllPostsReducer, getMyPostsReducer, getPostByIdReducer, getPostOfFollowingReducer, getUserPostsReducer, likeAndUnlikePostReducer, saveAndUnsavePostReducer, updatePostReducer } from "./Reducers/postReducer";
import { chatReducer } from "./Reducers/chatReducer";
import { commentReducer, replyReducer } from "./Reducers/commentReducer";


const store = configureStore({
    reducer: {
        userAuth: userAuthReducer,
        createPost: createPostReducer,
        post: getPostByIdReducer,
        allPosts: getAllPostsReducer,
        myPosts: getMyPostsReducer,
        userPosts: getUserPostsReducer,
        getOtherUsers: getAllOtherUsers,
        user: getUserReducer,
        follow: followAndUnfollowUserReducer,
        likePost: likeAndUnlikePostReducer,
        updateUser: updateUserReducer,
        followingPosts: getPostOfFollowingReducer,
        savePost: saveAndUnsavePostReducer,
        chat: chatReducer,
        comment: commentReducer,
        reply: replyReducer,
        updatePost: updatePostReducer,
        deletePost: deletePostReducer,
        notification: myNotificationsReducer,
        contact: contactUsReducer
    }
})

export default store