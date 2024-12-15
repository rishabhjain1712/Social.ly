import axios from 'axios';
import { BACKEND_URL } from '../../constants/urls';

const URL = BACKEND_URL + "api/v1/post";

axios.defaults.withCredentials = true

export const createPost = (details) => async (dispatch) => {
    try {
        dispatch({
            type: "CREATE_POST_REQUEST"
        })

        const { data } = await axios.post(`${URL}/create`, details, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        dispatch({
            type: "CREATE_POST_SUCCESS",
            payload: data.message
        })
        
    } catch (error) {
        dispatch({
            type: "CREATE_POST_FAILURE",
            payload: error.response?.data?.message
        })
    }
}

export const getAllPosts = () => async (dispatch) => {
    try {
        dispatch({
            type: "GET_ALL_POSTS_REQUEST"
        })

        const { data } = await axios.get(`${URL}/all`);

        dispatch({
            type: "GET_ALL_POSTS_SUCCESS",
            payload: data.data
        })
        
    } catch (error) {
        dispatch({
            type: "GET_ALL_POSTS_FAILURE",
            payload: error.response?.data?.message
        })
    }
}

export const getMyPosts = () => async (dispatch) => {
    try {
        dispatch({
            type: "GET_MY_POSTS_REQUEST"
        })

        const { data } = await axios.get(`${URL}/my`);

        dispatch({
            type: "GET_MY_POSTS_SUCCESS",
            payload: data.data
        })
        
    } catch (error) {
        dispatch({
            type: "GET_MY_POSTS_FAILURE",
            payload: error.response?.data?.message
        })
    }
}

export const getPostById = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "GET_POST_BY_ID_REQUEST"
        })

        const { data } = await axios.get(`${URL}/${id}`);

        dispatch({
            type: "GET_POST_BY_ID_SUCCESS",
            payload: data.data
        })
        
    } catch (error) {
        dispatch({
            type: "GET_POST_BY_ID_FAILURE",
            payload: error?.response?.data?.message
        })
    }
}

export const getUserPosts = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "GET_USER_POSTS_REQUEST"
        })

        const { data } = await axios.get(`${URL}/${id}`);

        dispatch({
            type: "GET_USER_POSTS_SUCCESS",
            payload: data.data
        })
        
    } catch (error) {
        dispatch({
            type: "GET_USER_POSTS_FAILURE",
            payload: error.response?.data?.message
        })
    }
}

export const updatePost = (id, caption) => async (dispatch) => {
    try {
        dispatch({
            type: "UPDATE_POST_REQUEST"
        })

        const { data } = await axios.patch(`${URL}/${id}`, {caption}, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        dispatch({
            type: "UPDATE_POST_SUCCESS",
            payload: data.message
        })
        
    } catch (error) {
        dispatch({
            type: "UPDATE_POST_FAILURE",
            payload: error.response?.data?.message
        })
    }
}

export const likeAndUnlikePost = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "LIKE_AND_UNLIKE_POST_REQUEST"
        })

        const { data } = await axios.get(`${URL}/like/${id}`);

        dispatch({
            type: "LIKE_AND_UNLIKE_POST_SUCCESS",
            payload: data.message
        })
        
    } catch (error) {
        dispatch({
            type: "LIKE_AND_UNLIKE_POST_FAILURE",
            payload: error?.response?.data?.message
        })
    }
}

export const getPostOfFollowing = () => async (dispatch) => {
    try {
        dispatch({
            type: "GET_POST_OF_FOLLOWING_REQUEST"
        })

        const { data } = await axios.get(`${URL}/following/posts`);

        dispatch({
            type: "GET_POST_OF_FOLLOWING_SUCCESS",
            payload: data.data
        })
        
    } catch (error) {
        dispatch({
            type: "GET_POST_OF_FOLLOWING_FAILURE",
            payload: error?.response?.data?.message
        })
    }
}

export const saveAndUnsavePost = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "SAVE_AND_UNSAVE_POST_REQUEST"
        })

        const { data } = await axios.get(`${URL}/save/${id}`);

        dispatch({
            type: "SAVE_AND_UNSAVE_POST_SUCCESS",
            payload: data.message
        })
        
    } catch (error) {
        dispatch({
            type: "SAVE_AND_UNSAVE_POST_FAILURE",
            payload: error?.response?.data?.message
        })
    }
}

export const deletePost = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "DELETE_POST_REQUEST"
        })

        const { data } = await axios.delete(`${URL}/${id}`);

        dispatch({
            type: "DELETE_POST_SUCCESS",
            payload: data.message
        })
        
    } catch (error) {
        dispatch({
            type: "DELETE_POST_FAILURE",
            payload: error?.response?.data?.message
        })
    }
}