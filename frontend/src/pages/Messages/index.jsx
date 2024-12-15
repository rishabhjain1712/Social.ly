import HomeLayout from '../../Layout/HomeLayout'
import React, { useEffect, useState } from 'react';
import '../../styles/MessagePage.css';
import UserList from '../../Components/Messages/UserList';
import Chat from '../../Components/Messages/Chat';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserChats } from '../../redux/Actions/chatActions';

const MessagePage = () => {
  const dispatch = useDispatch();
  const [selectedUser, setSelectedUser] = useState(null);
  const { id } = useParams();
  const { users } = useSelector((state) => state.getOtherUsers);

  useEffect(() => {
    if(id && users){
      dispatch(getUserChats(id));
      setSelectedUser(users.find((user) => user._id.toString() === id.toString()));
    }
  }, [id, users]);

  return (
    <div className="message-page">
      <UserList />
      <Chat selectedUser={selectedUser} />
    </div>
  );
};

const Message = () => (
    <HomeLayout>
        {<MessagePage />}
    </HomeLayout>
)

export default Message

