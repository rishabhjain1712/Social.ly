import React, { useEffect, useState } from 'react'
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Trash } from 'lucide-react';
import '../../styles/PostCard.css'
import { useDispatch, useSelector } from 'react-redux';
import { deletePost, likeAndUnlikePost, saveAndUnsavePost } from '../../redux/Actions/postActions';
import { toast } from 'react-toastify';
import toastOptions from '../../constants/toast';

const DropdownMenu = ({ onDelete }) => (
  <div className="drop-menu">
    <div onClick={onDelete} className="dropdown-item">
      <Trash style={{ marginRight: "8px" }} /> Delete
    </div>
  </div>
);

const PostCard = ({onComment, posts, onLike, onSave}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userAuth);

  const { message, error } = useSelector((state) => state.likePost);
  const { message: saveMessage, error: saveError } = useSelector((state) => state.savePost);

  const handleLike = (id) => {
    dispatch(likeAndUnlikePost(id));
  }

  const handleSave = (id) => {
    dispatch(saveAndUnsavePost(id));
  }

  const handleDelete = (id) => {
    dispatch(deletePost(id));
  };

  const handleDropdownToggle = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  useEffect(() => {
    if (message) {
      onLike();
      // toast.success(message, toastOptions);
      dispatch({ type: 'CLEAR_MESSAGE' });
    }
    if (error) {
      toast.error(error, toastOptions);
      dispatch({ type: 'CLEAR_ERROR' });
    }
    if (saveMessage) {
      onSave();
      // toast.success(saveMessage, toastOptions);
      dispatch({ type: 'CLEAR_MESSAGE' });
    }
    if (saveError) {
      toast.error(saveError, toastOptions);
      dispatch({ type: 'CLEAR_ERROR' });
    }
  }, [message, error, dispatch, toastOptions, saveMessage, saveError]);

  return (
    <div className="home-container">
      {posts && posts.map((post) => (
        <div key={post?._id} className="post-card">
          <div className="post-header">
            <div className="user-info">
              <img src={post?.owner?.avatar?.url} alt={post?.owner?.username} className="avatar" />
              <div className="user-details">
                <h3 className="user-name">{post?.owner?.username}</h3>
                <p className="user-location">{post?.location}</p>
              </div>
            </div>
            {/* <MoreHorizontal className="more-icon" style={{ cursor: "pointer", marginLeft: '12px', fontSize: '0.8rem' }} onClick={() => handleDropdownToggle("post")} />
              {activeDropdown === "post" && (
                  <DropdownMenu
                      onDelete={() => handleDelete(post?._id)}
                  />
              )} */}
            {/* <MoreHorizontal className="more-icon" /> */}
          </div>
          <img src={post?.image?.url} alt="Post visual" className="post-image" />
          <p className="post-content">{post?.caption}</p>
          <div className="post-actions">
            <div className="action-item" onClick={() => handleLike(post._id)}>
              <Heart className="action-icon" style={{
                color: post?.likes?.some((like) => like._id === user?._id) ? 'red' : 'inherit',
                fill: post?.likes?.some((like) => like._id === user?._id) ? 'red' : 'inherit',
                transition: 'color 0.5s ease, fill 0.5s ease'
              }} />
              <span>{post?.likes.length}</span>
            </div>
            <div className="action-item" onClick={() => onComment(post?._id)}>
              <MessageCircle className="action-icon" />
              <span>{post?.comments.length}</span>
            </div>
            <div className="action-item">
              <Share2 className="action-icon" />
            </div>
            <div className="action-item" onClick={() => handleSave(post._id)}>
              <Bookmark className="action-icon" style={{
                color: post?.saved?.some((save) => save._id === user?._id) ? '#00bfff' : 'inherit',
                fill: post?.saved?.some((save) => save._id === user?._id) ? '#00bfff' : 'inherit',
                transition: 'color 0.5s ease, fill 0.5s ease'
              }} />
              <span>{post?.saved.length}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PostCard
