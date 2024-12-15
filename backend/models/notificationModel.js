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

// Follow ✅ Testing ✅
// Unfollow ✅ Testing ✅
// Post Like ✅ Testing ✅
// Post Unlike ✅ Testing ✅
// Comment Like ✅ Testing ✅
// Comment Unlike ✅ Testing ✅
// Reply Like ✅ Testing ✅
// Reply Unlike ✅ Testing ✅
// Comment ✅ Testing ✅
// Reply ✅ Testing ✅
// Save post ✅ Testing ✅
// Unsave post ✅ Testing ✅
// Reply Delete ✅ Testing ❌
// Comment Delete ✅ Testing ❌
// Post Delete ✅ Testing ❌