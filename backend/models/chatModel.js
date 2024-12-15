import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User_Soc'
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        }
    ]
}, { 
    timestamps: true 
});

const Chat = mongoose.model('Chat', chatSchema);
export default Chat
