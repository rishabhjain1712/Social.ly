import axios from 'axios';
import { BACKEND_URL } from '../../constants/urls';

const URL = BACKEND_URL + "api/v1/post/comment";

axios.defaults.withCredentials = true

export const addComment = (postId, comment) => async (dispatch) => {
    try {
        dispatch({
            type: "ADD_COMMENT_REQUEST"
        })

        const { data } = await axios.post(`${URL}/${postId}`, {comment}, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        dispatch({
            type: "ADD_COMMENT_SUCCESS",
            payload: data.message
        })
        
    } catch (error) {
        dispatch({
            type: "ADD_COMMENT_FAILURE",
            payload: error?.response?.data?.message
        })
    }
}

export const getPostComments = (postId) => async (dispatch) => {
    try {
        dispatch({
            type: "GET_POST_COMMENTS_REQUEST"
        })

        const { data } = await axios.get(`${URL}/post/${postId}`);

        dispatch({
            type: "GET_POST_COMMENTS_SUCCESS",
            payload: data.data
        })
        
    } catch (error) {
        dispatch({
            type: "GET_POST_COMMENTS_FAILURE",
            payload: error?.response?.data?.message
        })
    }
}

export const likeAndUnlikeComment = (commentId) => async (dispatch) => {
    try {
        dispatch({
            type: "LIKE_AND_UNLIKE_COMMENT_REQUEST"
        })

        const { data } = await axios.get(`${URL}/like/${commentId}`);

        dispatch({
            type: "LIKE_AND_UNLIKE_COMMENT_SUCCESS",
            payload: data.message
        })
        
    } catch (error) {
        dispatch({
            type: "LIKE_AND_UNLIKE_COMMENT_FAILURE",
            payload: error?.response?.data?.message
        })
    }
}

export const updateComment = (commentId, comment) => async (dispatch) => {
    try {
        dispatch({
            type: "UPDATE_COMMENT_REQUEST"
        })

        const { data } = await axios.put(`${URL}/${commentId}`, {comment}, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        dispatch({
            type: "UPDATE_COMMENT_SUCCESS",
            payload: data.message
        })
        
    } catch (error) {
        dispatch({
            type: "UPDATE_COMMENT_FAILURE",
            payload: error?.response?.data?.message
        })
    }
}

export const deleteComment = (commentId) => async (dispatch) => {
    try {
        dispatch({
            type: "DELETE_COMMENT_REQUEST"
        })

        const { data } = await axios.delete(`${URL}/${commentId}`);

        dispatch({
            type: "DELETE_COMMENT_SUCCESS",
            payload: data.message
        })
        
    } catch (error) {
        dispatch({
            type: "DELETE_COMMENT_FAILURE",
            payload: error?.response?.data?.message
        })
    }
}

export const addReply = (commentId, reply) => async (dispatch) => {
    try {
        dispatch({
            type: "ADD_REPLY_REQUEST"
        })

        const { data } = await axios.post(`${URL}/reply/${commentId}`, {reply}, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        dispatch({
            type: "ADD_REPLY_SUCCESS",
            payload: data.message
        })
        
    } catch (error) {
        dispatch({
            type: "ADD_REPLY_FAILURE",
            payload: error?.response?.data?.message
        })
    }
}

export const likeAndUnlikeReply = (replyId) => async (dispatch) => {
    try {
        dispatch({
            type: "LIKE_AND_UNLIKE_REPLY_REQUEST"
        })

        const { data } = await axios.get(`${URL}/reply/like/${replyId}`);

        dispatch({
            type: "LIKE_AND_UNLIKE_REPLY_SUCCESS",
            payload: data.message
        })
        
    } catch (error) {
        dispatch({
            type: "LIKE_AND_UNLIKE_REPLY_FAILURE",
            payload: error?.response?.data?.message
        })
    }
}

export const updateReply = (replyId, reply) => async (dispatch) => {
    try {
        dispatch({
            type: "UPDATE_REPLY_REQUEST"
        })

        const { data } = await axios.put(`${URL}/reply/${replyId}`, {reply}, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        dispatch({
            type: "UPDATE_REPLY_SUCCESS",
            payload: data.message
        })
        
    } catch (error) {
        dispatch({
            type: "UPDATE_REPLY_FAILURE",
            payload: error?.response?.data?.message
        })
    }
}

export const deleteReply = (replyId) => async (dispatch) => {
    try {
        dispatch({
            type: "DELETE_REPLY_REQUEST"
        })

        const { data } = await axios.delete(`${URL}/reply/${replyId}`);

        dispatch({
            type: "DELETE_REPLY_SUCCESS",
            payload: data.message
        })
        
    } catch (error) {
        dispatch({
            type: "DELETE_REPLY_FAILURE",
            payload: error?.response?.data?.message
        })
    }
}