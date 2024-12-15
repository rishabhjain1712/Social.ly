import axios from 'axios';
import { BACKEND_URL } from '../../constants/urls';

const URL = BACKEND_URL + "/api/v1/chat";

axios.defaults.withCredentials = true

export const getUserChats = (userId) => async (dispatch) => {
    try {
        dispatch({
            type: "GET_USER_CHATS_REQUEST"
        })

        const { data } = await axios.get(`${URL}/user/${userId}`)

        dispatch({
            type: "GET_USER_CHATS_SUCCESS",
            payload: data.data
        })
        
    } catch (error) {
        dispatch({
            type: "GET_USER_CHATS_FAILURE",
            payload: error?.response?.data?.message
        })
    }
}

export const createChat = (content, userId) => async (dispatch) => {
    try {
        dispatch({
            type: "CREATE_CHAT_REQUEST"
        })

        const { data } = await axios.post(`${URL}/user/${userId}`, { content }, {
            headers: {
                "Content-Type": "application/json"
            }
        })

        dispatch({
            type: "CREATE_CHAT_SUCCESS",
            payload: data.message
        })
        
    } catch (error) {
        dispatch({
            type: "CREATE_CHAT_FAILURE",
            payload: error?.response?.data?.message
        })
    }
}

