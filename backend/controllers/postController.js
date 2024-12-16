import Post from "../models/postModel.js";
import { Response } from "../utils/response.js"
import cloudinary from "cloudinary";
import { message } from "../utils/message.js";
import User from "../models/userModel.js";
import Comment from "../models/commentModel.js";
import Reply from "../models/replyModel.js";
import Notification from "../models/notificationModel.js";

export const createPost = async (req, res) => {
    try {
        // Parsing body data
        const { image, caption, location, mentions } = req.body;

        // Checking body data
        if(!caption) {
            return Response(res, 400, false, message.missingFieldsMessage);
        }

        // Check image
        if(!image) {
            return Response(res, 400, false, message.imageMissingMessage);
        }

        // Upload image to cloudinary
        let imageUpload = await cloudinary.v2.uploader.upload(image, {
            folder: 'posts'
        })

        // Create post
        let post = await Post.create({
            image: {
                public_id: imageUpload.public_id,
                url: imageUpload.secure_url
            },
            caption, 
            location,
            owner: req.user._id
        })

        // Manage mentions
        let users = [], user;
        if (mentions) {
            users = await Promise.all(
                mentions.map(async (mention) => {
                    user = await User.findOne({ username: mention });
                    if(user){
                        user.taggedPosts.unshift(post._id);
                        await user.save();
                    }
                    return user ? user._id : null;
                })
            );

            users = users.filter((id) => id !== null);
        }

        // Add mentions to post
        post.mentions = users;
        await post.save();

        // Set post in user
        user = await User.findById(req.user._id);
        user.posts.unshift(post._id);
        await user.save();

        // Send Response
        Response(res, 201, true, message.postCreatedMessage, post);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const getAllPosts = async (req, res) => {
    try {
        // Find all posts
        const posts = await Post.find()
            .populate('mentions', 'firstName username avatar')
            .populate('likes', 'firstName username avatar')
            .populate('saved', 'firstName username avatar')
            .populate('owner', 'firstName username avatar')
            .sort({ createdAt: -1 });

        // Send response
        Response(res, 200, true, message.postsFoundMessage, posts);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const getPostById = async (req, res) => {
    try {
        // Parsin id
        const { id } = req.params;

        // Check id
        if(!id) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        // Find post
        const post = await Post.findById(id)
            .populate('owner', 'firstName username avatar')
            .populate('likes', 'firstName username avatar')
            .populate({
                path: 'comments',
                populate: [
                    {
                        path: 'reply',
                        populate: [
                            {
                                path: 'owner',
                                select: 'firstName middleName lastName username avatar'
                            },
                            {
                                path: 'likes',
                                select: 'firstName middleName lastName username avatar'
                            }
                        ]
                    },
                    {
                        path: 'owner',
                        select: 'firstName middleName lastName username avatar'
                    },
                    {
                        path: 'likes',
                        select: 'firstName middleName lastName username avatar'
                    }
                ]
            })
            .populate('saved', 'firstName username avatar')

        // Check post
        if(!post) {
            return Response(res, 404, false, message.postNotFoundMessage);
        }

        // Send response
        Response(res, 200, true, message.postFoundMessage, post);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const getMyPosts = async (req, res) => {
    try {
        // Find posts
        const posts = await Post.find({ owner: req.user._id }).populate('owner', 'firstName username avatar');

        // Send response
        Response(res, 200, true, message.postsFoundMessage, posts);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const getUserPosts = async (req, res) => {
    try {
        // Parsing id
        const { id } = req.params;

        // Check id
        if(!id) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        // Find posts
        const posts = await Post.find({ owner: id }).populate('owner', 'firstName username avatar');

        // Send response
        Response(res, 200, true, message.postsFoundMessage, posts);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const updatePost = async (req, res) => {
    try {
        // Parsing id
        const { id } = req.params;

        // Check id
        if(!id) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        // Find post
        const post = await Post.findById(id);

        // Check post
        if(!post) {
            return Response(res, 404, false, message.postNotFoundMessage);
        }

        // Check for owner
        if(post.owner.toString() !== req.user._id.toString()) {
            return Response(res, 403, false, message.unAuthorizedMessage);
        }

        // Parsing body data
        const { caption } = req.body;

        // Checking body data
        if(!caption) {
            return Response(res, 400, false, message.missingFieldsMessage);
        }

        // Update post
        post.caption = caption;
        await post.save();

        // Send response
        Response(res, 200, true, message.postUpdatedMessage);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const deletePost = async (req, res) => {
    try {
        // Parsing id
        const { id } = req.params;

        // Check id
        if(!id) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        // Find post
        const post = await Post.findById(id);

        // Check post
        if(!post) {
            return Response(res, 404, false, message.postNotFoundMessage);
        }

        // Check for owner
        if(post.owner.toString() !== req.user._id.toString()) {
            return Response(res, 403, false, message.unAuthorizedMessage);
        }

        // Delete image from cloudinary
        await cloudinary.v2.uploader.destroy(post.image.public_id);

        // Delete post from user's posts array
        let user = await User.findById(req.user._id);
        user.posts = user.posts.filter(postId => postId.toString() !== id);
        await user.save();

        // Comment & Reply Handler
        const comments = await Comment.find({ post: id });

        if (comments.length !== 0) {
            const commentIds = comments.map(comment => comment._id);
            const replies = await Reply.find({ comment: { $in: commentIds } });

            let userIds = [...new Set(comments.flatMap(comment => comment.likes))];

            await Comment.deleteMany({ post: id });

            await User.updateMany(
                { _id: { $in: userIds } },
                { $pull: { likedComments: { $in: commentIds } } }
            );

            if (replies.length !== 0) {
                const replyIds = replies.map(reply => reply._id);
                userIds = [...new Set(replies.flatMap(reply => reply.likes))];

                await Reply.deleteMany({ comment: { $in: commentIds } });

                await User.updateMany(
                    { _id: { $in: userIds } },
                    { $pull: { likedReplies: { $in: replyIds } } }
                );
            }
        }

        // Delete post from users' liked posts array
        if(post.likes.length !== 0) {
            await User.updateMany(
                { _id: { $in: post.likes } },
                { $pull: { likedPosts: id } }
            );
        }

        // Delete post from users' saved posts array
        if(post.saved.length !== 0) {
            await User.updateMany(
                { _id: { $in: post.saved } },
                { $pull: { savedPosts: id } }
            );
        }

        // Delete post from users' tagged posts array
        if(post.mentions.length !== 0) {
            await User.updateMany(
                { _id: { $in: post.mentions } },
                { $pull: { taggedPosts: id } }
            );
        }

        // Delete all notifications related to this post 🔔 ❌
        const notifications = await Notification.find({ post: id });
        const notificationIds = notifications.map(notification => notification._id);
        console.log("Something: ", notificationIds)

        await Notification.deleteMany({ post: id });

        await User.updateMany(
            {},
            { $pull: { notifications: { $in: notificationIds } } }
        );

        // Delete post
        await post.deleteOne();

        // Send response
        Response(res, 200, true, message.postDeletedMessage);
        
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}


export const likeAndUnlikePost = async (req, res) => {
    try {
        // Parsing id
        const { id } = req.params;

        // Check id
        if(!id) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        // Find post
        const post = await Post.findById(id);

        // Check post
        if(!post) {
            return Response(res, 404, false, message.postNotFoundMessage);
        }

        // Check if user has already liked the post
        if(post.likes.includes(req.user._id)) {
            // Remove user from likes array
            post.likes = post.likes.filter(like => like.toString() !== req.user._id.toString());
            await post.save();

            // Remove post from user's liked posts array
            let user = await User.findById(req.user._id);
            user.likedPosts = user.likedPosts.filter(postId => postId.toString() !== id);
            await user.save();

            // Remove liked notification from user
            let notification = await Notification.findOne({
                owner: user._id,
                activity: "like",
                entity: "Post",
                post: post._id
            })

            if(notification) {
                user = await User.findById(post.owner);
                user.notifications = user.notifications.filter(notificationId => notificationId.toString() !== notification._id.toString());
                await user.save();

                await notification.deleteOne();
            }

            // Send response
            Response(res, 200, true, message.postUnlikedMessage);
        } else {
            // Add user to likes array
            post.likes.push(req.user._id);
            await post.save();

            // Add post to user's liked posts array
            let user = await User.findById(req.user._id);
            user.likedPosts.unshift(post._id);
            await user.save();

            // If own post
            if(post.owner.toString() !== req.user._id.toString()) {
                // Create notification
                const notification = await Notification.create({
                    entity: 'Post',
                    activity: 'like',
                    owner: req.user._id,
                    post: post._id
                })
                
                // Add post to user's notifications array
                user = await User.findById(post.owner);
                user.notifications.unshift(notification._id);
                await user.save();
            }

            // Send response
            Response(res, 200, true, message.postLikedMessage);
        }
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const saveAndUnsavePost = async (req, res) => {
    try {
        // Parsing id
        const { id } = req.params;

        // Check id
        if(!id) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        // Find post
        const post = await Post.findById(id);

        // Check post
        if(!post) {
            return Response(res, 404, false, message.postNotFoundMessage);
        }

        let user = await User.findById(req.user._id);

        // Check if user has already saved the post
        if(post.saved.includes(req.user._id)) {
            // Remove user from saved array
            post.saved = post.saved.filter(save => save.toString() !== req.user._id.toString());
            await post.save();

            // Remove post from user's saved posts array
            user.savedPosts = user.savedPosts.filter(postId => postId.toString() !== id);
            await user.save();

            // If own post
            if(post.owner.toString() !== req.user._id.toString()) {
                // Create notification
                const notification = await Notification.create({
                    entity: 'Post',
                    activity: 'unsave',
                    owner: req.user._id,
                    post: post._id
                })
                
                // Add post to user's notifications array
                user = await User.findById(post.owner);
                user.notifications.unshift(notification._id);
                await user.save();
            }

            // Remove saved notification from user
            let notification = await Notification.findOne({
                owner: req.user._id,
                activity: "save",
                entity: "Post",
                post: post._id,
            })

            if(notification) {
                user = await User.findById(post.owner);
                user.notifications = user.notifications.filter(notificationId => notificationId.toString() !== notification._id.toString());
                await user.save();

                await notification.deleteOne();
            }

            // Send response
            Response(res, 200, true, message.postUnsavedMessage);
        } else {
            // Add user to saved array
            post.saved.unshift(req.user._id);
            await post.save();

            // Add post to user's saved posts array
            user.savedPosts.unshift(post._id);
            await user.save();

            // If own post
            if(post.owner.toString() !== req.user._id.toString()) {
                // Create notification
                const notification = await Notification.create({
                    entity: 'Post',
                    activity: 'save',
                    owner: req.user._id,
                    post: post._id
                })
                
                // Add post to user's notifications array
                user = await User.findById(post.owner);
                user.notifications.unshift(notification._id);
                await user.save();
            }

            // Remove saved notification from user
            let notification = await Notification.findOne({
                owner: req.user._id,
                activity: "unsave",
                entity: "Post",
                post: post._id,
            })

            if(notification) {
                user = await User.findById(post.owner);
                user.notifications = user.notifications.filter(notificationId => notificationId.toString() !== notification._id.toString());
                await user.save();

                await notification.deleteOne();
            }

            // Send response
            Response(res, 200, true, message.postSavedMessage);
        }
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const getPostOfFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        // Fetch all posts where the `owner` field matches any user in the `following` array
        const posts = await Post.find({ owner: { $in: user.following } })
            .populate('owner', 'firstName username avatar')
            .populate('likes', 'firstName username avatar')
            .populate('saved', 'firstName username avatar')
            .populate('mentions', 'firstName username avatar')
            .sort({ createdAt: -1 });

        // Send response
        Response(res, 200, true, message.postsFoundMessage, posts);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}



export const addComment = async (req, res) => {
    try {
        // Parsing id
        const { postId } = req.params;

        // Check id
        if(!postId) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        // Find post
        const post = await Post.findById(postId);

        // Check post
        if(!post) {
            return Response(res, 404, false, message.postNotFoundMessage);
        }

        // Parsing body data
        const { comment } = req.body;

        // Checking the body data
        if(!comment) {
            return Response(res, 400, false, message.missingFieldsMessage);
        }

        // Add comment
        const newComment = await Comment.create({
            comment,
            owner: req.user._id,
            post: post._id
        });

        // Set comment in post
        post.comments.push(newComment._id);
        await post.save();

        // If not own post
        if(post.owner.toString() !== req.user._id.toString()) {
            // Create notification
            const notification = await Notification.create({
                entity: 'Post',
                activity: 'comment',
                owner: req.user._id,
                post: post._id,
                comment: newComment._id
            })
    
            // Add comment to user's notifications array
            let user = await User.findById(post.owner);
            user.notifications.unshift(notification._id);
            await user.save();
        }

        // Send response
        Response(res, 200, true, message.commentAddedMessage, newComment);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const likeAndUnlikeComment = async (req, res) => {
    try {
        // Parsing id
        const { commentId } = req.params;

        // Check id
        if(!commentId) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        // Find comment
        const comment = await Comment.findById(commentId);

        // Check comment
        if(!comment) {
            return Response(res, 404, false, message.commentNotFoundMessage);
        }

        // Check if user has already liked the comment
        let user = await User.findById(req.user._id);
        if(comment.likes.includes(req.user._id)) {
            // Remove user from likes array
            comment.likes = comment.likes.filter(like => like.toString() !== req.user._id.toString());
            await comment.save();

            // Remove comment from user's liked comments array
            user.likedComments = user.likedComments.filter(commentId => commentId.toString() !== commentId.toString());
            await user.save();

            // Remove liked notification from user
            let notification = await Notification.findOne({
                owner: user._id,
                activity: "like",
                entity: "Comment",
                post: comment.post,
                comment: comment._id
            })

            if(notification) {
                user = await User.findById(comment.owner);
                user.notifications = user.notifications.filter(notificationId => notificationId.toString() !== notification._id.toString());
                await user.save();

                await notification.deleteOne();
            }

            // Send response
            Response(res, 200, true, message.commentUnlikedMessage);
        } else {
            // Add user to likes array
            comment.likes.unshift(req.user._id);
            await comment.save();

            // Add comment to user's liked comments array
            user.likedComments.unshift(comment._id);
            await user.save();

            // If own comment
            if(comment.owner.toString() !== req.user._id.toString()) {
                // Create notification
                const notification = await Notification.create({
                    entity: 'Comment',
                    activity: 'like',
                    owner: req.user._id,
                    comment: comment._id,
                    post: comment.post
                })
                
                // Add comment to user's notifications array
                user = await User.findById(comment.owner);
                user.notifications.unshift(notification._id);
                await user.save();
            }

            // Send response
            Response(res, 200, true, message.commentLikedMessage);
        }
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const updateComment = async (req, res) => {
    try {
        // Parsing id
        const { commentId } = req.params;

        // Check id
        if(!commentId) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        // Find comment
        const comment = await Comment.findById(commentId);

        // Check comment
        if(!comment) {
            return Response(res, 404, false, message.commentNotFoundMessage);
        }

        // Check for owner
        if(comment.owner.toString() !== req.user._id.toString()) {
            return Response(res, 403, false, message.unAuthorizedMessage);
        }

        // Parsing body data
        const { comment: newComment } = req.body;

        // Checking the body data
        if(!newComment) {
            return Response(res, 400, false, message.missingFieldsMessage);
        }

        // Update comment
        comment.comment = newComment;
        await comment.save();

        // Send response
        Response(res, 200, true, message.commentUpdatedMessage, comment);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const deleteComment = async (req, res) => {
    try {
        // Parsing id
        const { commentId } = req.params;

        // Check id
        if(!commentId) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        // Find comment
        const comment = await Comment.findById(commentId);

        // Check comment
        if(!comment) {
            return Response(res, 404, false, message.commentNotFoundMessage);
        }

        // Check for owner
        if(comment.owner.toString() !== req.user._id.toString()) {
            return Response(res, 403, false, message.unAuthorizedMessage);
        }

        // Remove comment from all users' liked comments array
        await User.updateMany(
            { _id: { $in: comment.likes } },
            { $pull: { likedComments: commentId } }
        );

        // Delete comment from post's comments array
        let post = await Post.findById(comment.post);
        post.comments = post.comments.filter(id => id.toString() !== commentId.toString());
        await post.save();

        // Deleting all replies from users' liked replies array
        const replies = await Reply.find({ comment: commentId });
        const replyIds = replies.map(reply => reply._id);

        if (replies.length !== 0) {            
            // Extract reply IDs and user IDs from the likes array
            const userIds = [...new Set(replies.flatMap(reply => reply.likes))];
    
            // Remove the replies in bulk
            await Reply.deleteMany({ comment: commentId });
    
            // Remove these reply IDs from users' likedReplies arrays
            await User.updateMany(
                { _id: { $in: userIds } },
                { $pull: { likedReplies: { $in: replyIds } } }
            );
        }

        // Delete all notifications related to this comment 🔔 ❌
        const notifications = await Notification.find(
            { $or: [{ comment: commentId }, { reply: { $in: replyIds } }] },
            '_id'
        );
        const notificationIds = notifications.map(notification => notification._id);

        await Notification.deleteMany({ _id: { $in: notificationIds } });

        await User.updateMany(
            { notifications: { $in: notificationIds } },
            { $pull: { notifications: { $in: notificationIds } } }
        );

        // Delete comment
        await comment.deleteOne();

        // Send response
        Response(res, 200, true, message.commentDeletedMessage);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const getPostComments = async (req, res) => {
    try {
        // Parsing id
        const { postId } = req.params;

        // Check id
        if(!postId) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        // Find post
        const post = await Post.findById(postId)
            .populate({
                path: 'comments',
                populate: [
                    {
                        path: 'reply',
                        populate: [
                            {
                                path: 'owner',
                                select: 'firstName middleName lastName username avatar'
                            },
                            {
                                path: 'likes',
                                select: 'firstName middleName lastName username avatar'
                            }
                        ]
                    },
                    {
                        path: 'owner',
                        select: 'firstName middleName lastName username avatar'
                    },
                    {
                        path: 'likes',
                        select: 'firstName middleName lastName username avatar'
                    }
                ]
            })

        // Check post
        if(!post) {
            return Response(res, 404, false, message.postNotFoundMessage);
        }

        // Send response
        Response(res, 200, true, message.postFoundMessage, post.comments);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

// Add a new reply
export const addReply = async (req, res) => {
    try {
        // Parsing id
        const { commentId } = req.params;

        // Check id
        if(!commentId) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        // Find comment
        const comment = await Comment.findById(commentId).populate('post');

        // Check comment
        if(!comment) {
            return Response(res, 404, false, message.commentNotFoundMessage);
        }

        // Parsing body data
        const { reply } = req.body;

        // Checking the body data
        if(!reply) {
            return Response(res, 400, false, message.missingFieldsMessage);
        }

        // Add reply
        const newReply = await Reply.create({
            reply,
            owner: req.user._id,
            comment: comment._id
        })

        // Add reply in comment
        comment.reply.push(newReply._id);
        await comment.save();

        // Create notification
        const notification = await Notification.create({
            entity: "Comment",
            activity: "reply",
            comment: comment._id,
            post: comment.post._id,
            owner: req.user._id,
            reply: newReply._id
        })

        let user, flag=false;

        // If own post
        if(comment.post.owner.toString() !== req.user._id.toString()) {
            // Add notification in post owner
            user = await User.findById(comment.post.owner);
            user.notifications.unshift(notification._id);
            await user.save();
            flag = true;
        }

        // If own comment
        if(comment.owner.toString() !== req.user._id.toString() && !flag) {
            // Add notification in commented user
            user = await User.findById(comment.owner);
            user.notifications.unshift(notification._id);
            await user.save();
            flag = true;
        }

        if(!flag) {
            await notification.deleteOne();
        }

        // Send response
        Response(res, 200, true, message.replyAddedMessage, newReply);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const likeAndUnlikeReply = async (req, res) => {
    try {
        // Parsing id
        const { replyId } = req.params;

        // Check id
        if(!replyId) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        // Find reply
        const reply = await Reply.findById(replyId).populate('comment');

        // Check reply
        if(!reply) {
            return Response(res, 404, false, message.replyNotFoundMessage);
        }

        // Check if user has already liked the reply
        let user = await User.findById(req.user._id);
        if(reply.likes.includes(req.user._id)) {
            // Remove user from likes array
            reply.likes = reply.likes.filter(like => like.toString() !== req.user._id.toString());
            await reply.save();

            // Remove reply from user's liked replies array
            user.likedReplies = user.likedReplies.filter(replyId => replyId.toString() !== reply._id.toString());
            await user.save();

            // Remove liked notification from user
            let notification = await Notification.findOne({
                owner: user._id,
                activity: "like",
                entity: "Reply",
                post: reply.comment.post,
                reply: reply._id
            })

            if(notification) {
                user = await User.findById(reply.owner);
                user.notifications = user.notifications.filter(notificationId => notificationId.toString() !== notification._id.toString());
                await user.save();

                await notification.deleteOne();
            }

            // Send response
            Response(res, 200, true, message.replyUnlikedMessage);
        } else {
            // Add user to likes array
            reply.likes.unshift(req.user._id);
            await reply.save();

            // Add reply to user's liked replies array
            user.likedReplies.unshift(reply._id);
            await user.save();

            // If own reply
            if(reply.owner.toString() !== req.user._id.toString()) {
                // Create notification
                const notification = await Notification.create({
                    entity: 'Reply',
                    activity: 'like',
                    owner: req.user._id,
                    reply: reply._id,
                    post: reply.comment.post
                })
                
                // Add comment to user's notifications array
                user = await User.findById(reply.owner);
                user.notifications.unshift(notification._id);
                await user.save();
            }

            // Send response
            Response(res, 200, true, message.replyLikedMessage);
        }
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const updateReply = async (req, res) => {
    try {
        // Parsing id
        const { replyId } = req.params;

        // Check id
        if(!replyId) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        // Find reply
        const reply = await Reply.findById(replyId);

        // Check reply
        if(!reply) {
            return Response(res, 404, false, message.replyNotFoundMessage);
        }

        // Check for owner
        if(reply.owner.toString() !== req.user._id.toString()) {
            return Response(res, 403, false, message.unAuthorizedMessage);
        }

        // Parsing body data
        const { reply: newReply } = req.body;

        // Checking the body data
        if(!newReply) {
            return Response(res, 400, false, message.missingFieldsMessage);
        }

        // Update reply
        reply.reply = newReply;
        await reply.save();

        // Send response
        Response(res, 200, true, message.replyUpdatedMessage, reply);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

export const deleteReply = async (req, res) => {
    try {
        // Parsing id
        const { replyId } = req.params;

        // Check id
        if(!replyId) {
            return Response(res, 400, false, message.idNotFoundMessage);
        }

        // Find reply
        const reply = await Reply.findById(replyId);

        // Check reply
        if(!reply) {
            return Response(res, 404, false, message.replyNotFoundMessage);
        }

        // Check for owner
        if(reply.owner.toString() !== req.user._id.toString()) {
            return Response(res, 403, false, message.unAuthorizedMessage);
        }

        // Remove reply from all users' liked replies array
        await User.updateMany(
            { _id: { $in: reply.likes } },
            { $pull: { likedReplies: replyId } }
        );

        // Delete reply from comment's array
        let comment = await Comment.findById(reply.comment);
        comment.reply = comment.reply.filter(repId => repId.toString() !== replyId.toString());
        await comment.save();

        // Delete all notifications related to this reply 🔔 ❌
        const notifications = await Notification.find({ reply: reply._id });
        const notificationIds = notifications.map(notification => notification._id);

        if (notificationIds.length !== 0) {
            await Notification.deleteMany({ _id: { $in: notificationIds } });

            // Step 3: Remove the notification IDs from all users
            await User.updateMany(
                { notifications: { $in: notificationIds } },
                { $pull: { notifications: { $in: notificationIds } } }
            );
        }

        // Delete reply
        await reply.deleteOne();

        // Send response
        Response(res, 200, true, message.replyDeletedMessage);
        
    } catch (error) {
        Response(res, 500, false, error.message);
    }
}

