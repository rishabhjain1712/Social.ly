import React, { useEffect, useState } from 'react'
import HomeLayout from '../../Layout/HomeLayout'
import PostCard from '../../Components/Cards/PostCard';
import { useDispatch, useSelector } from 'react-redux';
import { getPostOfFollowing } from '../../redux/Actions/postActions';
import { toast } from 'react-toastify';
import toastOptions from '../../constants/toast';
import useModal from '../../hooks/useModal';
import ViewPostModal from '../../Components/Modals/ViewPostModal';

const Page = ({ onClose }) => {
  
  const [postData, setPostData] = useState([]);
  const dispatch = useDispatch();
  const { error, posts } = useSelector(state => state.followingPosts);

  const { isModalOpen, activePost, handlePostClick, setIsModalOpen } = useModal();

  const onLoading = () => {
    dispatch(getPostOfFollowing());
  }

  const handleCommentClick = (id) => {
    handlePostClick(id)
  };

  const handleLike = () => {
    dispatch(getPostOfFollowing());
  };

  const handleSave = () => {
    dispatch(getPostOfFollowing());
  };

  useEffect(() => {
    dispatch(getPostOfFollowing());
  }, [dispatch])

  useEffect(() => {
    if(isModalOpen){
      onClose(true);
    } else {
      onClose(false);
    }
  }, [isModalOpen])

  useEffect(() => {
    if(error){
      toast.error(error, toastOptions);
      dispatch({ type: "CLEAR_ERROR" })
    }
    if(posts){
      setPostData(posts)
    }
  }, [error, posts, dispatch, toastOptions]);

  return (
    <>
      <PostCard posts={postData} onLike={handleLike} onSave={handleSave} onComment={handleCommentClick} />
      {
        isModalOpen && (
          <ViewPostModal
            post={activePost}
            onClose={() => setIsModalOpen(false)}
            onLoad={() => onLoading()}
          />
        )
      }
    </>
  );
};


const Home = () => (
    <HomeLayout>
        {<Page />}
    </HomeLayout>
)

export default Home
