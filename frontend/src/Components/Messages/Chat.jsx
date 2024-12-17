import React, { useEffect, useState } from 'react';
import '../../styles/Chat.css';
import { Send } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toastOptions from '../../constants/toast';
import { toast } from 'react-toastify';
import { createChat } from '../../redux/Actions/chatActions';
import { io } from "socket.io-client"

const Chat = ({selectedUser}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);
  const socket = io(process.env.REACT_APP_BACKEND_URL);

  const dispatch = useDispatch();
  const { loading, error, message, chat } = useSelector((state) => state.chat);
  const { user: currentUser } = useSelector((state) => state.userAuth);

  useEffect(() => {
    // Join user's room
    if (currentUser?._id) {
        socket.emit('joinRoom', currentUser._id);
        // console.log(`User ${currentUser._id} joined their room`);
    }

    // Listen for new messages
    socket.on('newMessage', (receivedMessage) => {
        // console.log("Received new message: ", receivedMessage);
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    });

    return () => {
        socket.off('newMessage');
    };
}, [currentUser]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    dispatch(createChat(newMessage, user?._id));
  };

  useEffect(() => {
    setUser(selectedUser);
  }, [selectedUser]);

  useEffect(() => {
    if(chat){
      setMessages(chat.messages)
    }
  }, [chat])

  useEffect(() => {
    if(error){
      toast.error(error, toastOptions);
      dispatch({ type: "CLEAR_ERROR" })
    }
    if(message){
      setMessages((prevMessages) => [
        ...prevMessages, 
        {
          _id: Date.now(),
          content: newMessage, 
          sender: currentUser._id
        }
      ]);
      // toast.success(message, toastOptions);
      dispatch({ type: "CLEAR_MESSAGE" })
    }
  }, [error, toastOptions, dispatch, message]);

  useEffect(() => {
    setNewMessage('');
  }, [messages])

  if (!selectedUser) {
    return (
      <div className="chat-section default">
        <div className="default-chat-placeholder">
          <h2>No Chat Selected</h2>
          <p>Select a chat to view messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-section">
      <div className="chat-header">
        <div
          className="chat-user-avatar"
          style={{ backgroundImage: user?.avatar?.url != 'none' ? `url(${user?.avatar?.url})` : 'url(https://via.placeholder.com/50)' }}
        ></div>
        <div>
          <h4 className="chat-user-name">{`${user?.firstName} ${user?.middleName} ${user?.lastName}`}</h4>
        </div>
      </div>
      <div className="chat-messages">
        {messages && messages.length > 0 && messages?.map((msg) => (
          <div
            key={msg._id}
            className={`chat-message ${msg.sender === currentUser?._id ? 'sent' : 'received'}`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button disabled={newMessage.trim() === '' || loading} onClick={handleSendMessage}>
          <Send className="send-icon" />
        </button>
      </div>
    </div>
  );
};

export default Chat;
