import React, { useEffect, useState } from 'react';
import '../../styles/Profile.css';
import ProfileCard from '../../Components/Cards/ProfileCard';
import PostCard from '../../Components/Cards/PostCard';
import ViewPostModal from '../../Components/Modals/ViewPostModal';
import useModal from '../../hooks/useModal';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { followUser, getUser, loadUser, unfollowUser } from '../../redux/Actions/userActions';
import { toast } from 'react-toastify';
import toastOptions from '../../constants/toast';
import LoadingPage from '../../Components/Loading/Loading';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollow, setIsFollow] = useState(true);
  const [isUnFollow, setIsUnFollow] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const params = useParams();
  const dispatch = useDispatch();

  const { loading, user, error } = useSelector(state => state.user)
  const { userLoading, user: currentUser } = useSelector(state => state.userAuth)
  const { message, error: followError } = useSelector(state => state.follow)

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

  const { isModalOpen, postData, activePost, handlePostClick, setIsModalOpen } = useModal();

  const handleFollow = () => {
    dispatch(followUser(params.id));
  }

  const handleUnFollow = () => {
    dispatch(unfollowUser(params.id));
  }

  useEffect(() => {
    dispatch(getUser(params.id));
  }, [dispatch, params.id]);

  useEffect(() => {
    if (error) {
      toast.error(error, toastOptions);
    }
    if(user && currentUser) {
      if(user._id === currentUser._id){
        setIsFollow(false);
        setIsUnFollow(false);
      } else if(user.followers.some((follower) => follower._id === currentUser._id)){
        setIsFollow(false);
        setIsUnFollow(true);
      } else {
        setIsFollow(true);
        setIsUnFollow(false);
      }
    }
  }, [error, toastOptions, user, currentUser]);

  useEffect(() => {
    if (followError) {
      toast.error(followError, toastOptions);
      dispatch({ type: "CLEAR_ERROR" });
    }
    if(message){
      toast.success(message, toastOptions);
      dispatch({ type: "CLEAR_MESSAGE" });
      dispatch(loadUser());
    }
  }, [followError, toastOptions, message, dispatch]);

  return (
    userLoading===false || loading===false ? (
      <div className="profile-page">
        <div className="profile-header-cont">
          <ProfileCard bio={bio} user={user} isEdit={false} isFollow={isFollow} isUnfollow={isUnFollow} setFollow={handleFollow} setUnfollow={handleUnFollow} />
        </div>

        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => handleTabChange('posts')}
          >
            Posts
          </button>
          {/* <button
            className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => handleTabChange('saved')}
          >
            Saved Posts
          </button> */}
          <button
            className={`tab-btn ${activeTab === 'tagged' ? 'active' : ''}`}
            onClick={() => handleTabChange('tagged')}
          >
            Tagged Posts
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'posts' && (
            <div className="posts-grid">
              {user?.posts && user?.posts.map((post) => (
                <div key={post._id} className="post-item" onClick={() => handlePostClick(post?._id)}>
                  <img src={post?.image?.url} alt="Post" className="post-image" />
                  <div className="post-caption">{post.caption}</div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'tagged' && (
            <div className="posts-grid">
              {user?.taggedPosts && user?.taggedPosts.map((post) => (
                <div key={post._id} className="post-item" onClick={() => handlePostClick(post?._id)}>
                  <img src={post?.image?.url} alt="Post" className="post-image" />
                  <div className="post-caption">{post.caption}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {isModalOpen && (
          <ViewPostModal post={postData} onClose={() => setIsModalOpen(false)} />
        )}
      </div>
    ) : (
      <LoadingPage />
    )
  );
};

export default UserProfile
