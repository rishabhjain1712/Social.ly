import React, { useEffect, useState } from 'react';
import '../../styles/UserList.css';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const lastMessage = [
    'Hey! How are you?',
    'See you tomorrow!',
    'Can we reschedule? This is on very urgent basis'
  ]
  // const users = [
  //   {
  //     id: 1,
  //     name: 'John Doe',
  //     avatar: 'https://via.placeholder.com/40',
  //     lastMessage: 'Hey! How are you?',
  //     time: '2h',
  //   },
  //   {
  //     id: 2,
  //     name: 'Jane Smith',
  //     avatar: 'https://via.placeholder.com/40',
  //     lastMessage: 'See you tomorrow!',
  //     time: '4h',
  //   },
  //   {
  //     id: 3,
  //     name: 'Alice Johnson',
  //     avatar: 'https://via.placeholder.com/40',
  //     lastMessage: 'Great job on the project!',
  //     time: '1d',
  //   },
  //   {
  //     id: 4,
  //     name: 'David Williams',
  //     avatar: 'https://via.placeholder.com/40',
  //     lastMessage: 'Can we reschedule? This is on very urgent basis',
  //     time: '3d',
  //   },
  // ];

  const { users } = useSelector((state) => state.getOtherUsers);
  const navigate = useNavigate();

  const handleClick = (user) => {
    navigate(`/messages/${user._id}`)
  }

  useEffect(() => {
    if(users){
      if(users.length === 0) return
      const filteredUser = users.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) 
          // || user.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filteredUser);
    }
  }, [searchTerm, users]);

  return (
    <div className="user-list">
      <h3 className="user-list-title">Chats</h3>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search..."
        className="user-search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="user-list-items">
        {filteredUsers.map((user, index) => (
          <li
            key={user._id}
            className="user-item"
            onClick={() => handleClick(user)}
          >
            <div
              className="user-avatar"
              style={{ backgroundImage: `url(${user?.avatar?.url})` }}
            ></div>
            <div className="user-info">
              <h4 className="user-name">{user?.username}</h4>
              <p className="user-last-message">{lastMessage[index%3]}</p>
            </div>
            <div className="user-meta">
              <span className="last-message-time">2h</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
