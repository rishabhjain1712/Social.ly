import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
    entity: {
        type: String,
        required: true,
        enum: ['Post', 'Comment', 'User', 'Reply']
    },
    activity: {
        type: String,
        required: true,
        enum: ['like', 'comment', 'reply', 'follow', 'unfollow', 'save', 'unsave']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User_Soc'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    reply: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reply'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User_Soc'
    }
}, {
    timestamps: true 
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification

// Follow ✅
// Unfollow ✅
// Post Like ✅
// Post Unlike ✅
// Comment Like ✅
// Comment Unlike ✅
// Reply Like ✅
// Reply Unlike ✅
// Comment ✅
// Reply ✅
// Save post ✅
// Unsave post ✅
// Reply Delete ✅
// Comment Delete ✅
// Post Delete ✅