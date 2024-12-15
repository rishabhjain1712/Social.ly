import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPostById } from "../redux/Actions/postActions";
import { toast } from "react-toastify";
import toastOptions from "../constants/toast";

const useModal = () => {

    const dispatch = useDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activePost, setActivePost] = useState(null);

    const { post, error } = useSelector((state) => state.post);

    const handlePostClick = useCallback((postId) => {
      dispatch(getPostById(postId));
      setIsModalOpen(true);
    }, []);

    useEffect(() => {
      if (error) {
        toast.error(error, toastOptions);
        dispatch({ type: "CLEAR_ERROR" });
      }
      if(post){
        setActivePost(post);
      }
    }, [error, post, dispatch, toastOptions]);

    useEffect(() => {
      if (isModalOpen) {
        document.body.style.overflow = "hidden"; // Disable scroll
      } else {
        document.body.style.overflow = ""; // Restore scroll
      }

      // Cleanup on component unmount
      return () => {
        document.body.style.overflow = "";
      };
    }, [isModalOpen]);

    return { isModalOpen, activePost, handlePostClick, setIsModalOpen };
};

export default useModal;
