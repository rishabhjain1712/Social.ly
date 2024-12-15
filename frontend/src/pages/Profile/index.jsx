import React, { useState } from 'react';
import HomeLayout from '../../Layout/HomeLayout'
import '../../styles/Profile.css';
import ProfileCard from '../../Components/Cards/ProfileCard';
import useModal from '../../hooks/useModal';
import ViewPostModal from '../../Components/Modals/ViewPostModal';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from '../../redux/Actions/userActions';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('posts');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userAuth);

  const onLoading = () => {
    dispatch(loadUser());
  }

  const posts = [
    { id: 1, image: 'https://via.placeholder.com/200', caption: 'Exploring the mountains!' },
    { id: 2, image: 'https://via.placeholder.com/200', caption: 'Coffee is life ☕' },
    { id: 3, image: 'https://via.placeholder.com/200', caption: 'Hello from the other side!' },
    { id: 4, image: 'https://via.placeholder.com/200', caption: 'Sunset vibes 🌅' },
    { id: 5, image: 'https://via.placeholder.com/200', caption: 'Beautiful city views!' },
    { id: 6, image: 'https://via.placeholder.com/200', caption: 'Having a great time with friends!' },
  ];

  const bio = [
    "Frontend Developer | Coffee Lover ☕ | Dreamer 🌟 ",
    "Living in the city, coding, and exploring the world.",
    "Passionate about creating engaging user experiences.",
    "Always seeking new challenges and opportunities to grow as a developer. Stay tuned for updates! Or you can connect with me on",
  ]

  const { isModalOpen, activePost, handlePostClick, setIsModalOpen } = useModal();

  return (
    <div className="profile-page">
      <ProfileCard bio={bio} user={user} isEdit={false} isFollow={false} isUnfollow={false} />

      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => handleTabChange('posts')}
        >
          Posts
        </button>
        <button
          className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => handleTabChange('saved')}
        >
          Saved Posts
        </button>
        <button
          className={`tab-btn ${activeTab === 'tagged' ? 'active' : ''}`}
          onClick={() => handleTabChange('tagged')}
        >
          Tagged Posts
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'posts' && (
          <div className="posts-grid" style={{ zIndex: `${user?.posts?.length>0 ? 1 : -1}`}}>
            {user?.posts?.length>0 && user?.posts.map((post) => (
              <div key={post._id} className="post-item" onClick={() => handlePostClick(post?._id)}>
                <img src={post.image.url} alt="Post" className="post-image" />
                <div className="post-caption">{post.caption}</div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'saved' && (
          <div className="posts-grid">
            {user?.savedPosts?.length>0 && user?.savedPosts.map((post) => (
              <div key={post._id} className="post-item" onClick={() => handlePostClick(post?._id)}>
                <img src={post.image.url} alt="Post" className="post-image" />
                <div className="post-caption">{post.caption}</div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'tagged' && (
          <div className="posts-grid">
            {user?.taggedPosts?.length>0 && user?.taggedPosts.map((post) => (
              <div key={post._id} className="post-item" onClick={() => handlePostClick(post?._id)}>
                <img src={post.image.url} alt="Post" className="post-image" />
                <div className="post-caption">{post.caption}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      {
        isModalOpen && (
          <ViewPostModal
            // post={postData}
            post={activePost}
            onClose={() => setIsModalOpen(false)}
            onLoad={() => onLoading()}
          />
        )
      }
    </div>
  );
};


const Profile = () => (
    <HomeLayout>
        {<ProfilePage />}
    </HomeLayout>
)

export default Profile
