import axios from 'axios';
import { BACKEND_URL } from '../../constants/urls';

const URL = BACKEND_URL + "api/v1/user";

axios.defaults.withCredentials = true

export const loginUser = (email, password) => async (dispatch) => {
    try {
        dispatch({
            type: "USER_LOGIN_REQUEST"
        })

        const { data } = await axios.post(`${URL}/login`, { email, password }, {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        });

        dispatch({
            type: "USER_LOGIN_SUCCESS",
            payload: {
                message: data.message,
                id: data.data
            }
        })
        
    } catch (error) {
        dispatch({
            type: "USER_LOGIN_FAILURE",
            payload: error.response?.data?.message
        })
    }
}

export const verifyLoginOtp = (id, otp) => async (dispatch) => {
    try {
        dispatch({
            type: "LOGIN_OTP_REQUEST"
        })

        const { data } = await axios.post(`${URL}/login/verify/${id}`, { otp }, {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        })

        dispatch({
            type: "LOGIN_OTP_SUCCESS",
            payload: data.message
        })
        
    } catch (error) {
        dispatch({
            type: "LOGIN_OTP_FAILURE",
            payload: error.response?.data?.message
        })
    }
}

export const registerUser = (details) => async (dispatch) => {
    try {
        dispatch({
            type: "USER_REGISTER_REQUEST"
        })

        const { data } = await axios.post(`${URL}/register`, details, {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        });

        dispatch({
            type: "USER_REGISTER_SUCCESS",
            payload: {
                message: data.message,
                id: data.data
            }
        })
        
    } catch (error) {
        dispatch({
            type: "USER_REGISTER_FAILURE",
            payload: error.response?.data?.message
        })
    }
}

export const verifyUserOtp = (id, otp) => async (dispatch) => {
    try {
        dispatch({
            type: "VERIFY_OTP_REQUEST"
        })

        const { data } = await axios.post(`${URL}/verify/${id}`, { otp }, {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        })

        dispatch({
            type: "VERIFY_OTP_SUCCESS",
            payload: data.message
        })
        
    } catch (error) {
        dispatch({
            type: "VERIFY_OTP_FAILURE",
            payload: error.response?.data?.message
        })
    }
}

export const resendLoginOtp = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "RESEND_LOGIN_OTP_REQUEST"
        })

        const { data } = await axios.get(`${URL}/login/resend/${id}`)

        dispatch({
            type: "RESEND_LOGIN_OTP_SUCCESS",
            payload: data.message
        })
        
    } catch (error) {
        dispatch({
            type: "RESEND_LOGIN_OTP_FAILURE",
            payload: error.response?.data?.message
        })
    }
}

export const resendVerifyOtp = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "RESEND_VERIFY_OTP_REQUEST"
        })

        const { data } = await axios.get(`${URL}/resend/${id}`)

        dispatch({
            type: "RESEND_VERIFY_OTP_SUCCESS",
            payload: data.message
        })
        
    } catch (error) {
        dispatch({
            type: "RESEND_VERIFY_OTP_FAILURE",
            payload: error.response?.data?.message
        })
    }
}

export const loadUser = () => async (dispatch) => {
    try {
        dispatch({
            type: "LOAD_USER_REQUEST"
        })

        const { data } = await axios.get(`${URL}/me`)

        dispatch({
            type: "LOAD_USER_SUCCESS",
            payload: data.data
        })
        
    } catch (error) {
        dispatch({
            type: "LOAD_USER_FAILURE",
            payload: error.response?.data?.message
        })
    }
}

export const logoutUser = () => async (dispatch) => {
    try {
        dispatch({
            type: "LOGOUT_USER_REQUEST"
        })

        const { data } = await axios.get(`${URL}/logout`)

        dispatch({
            type: "LOGOUT_USER_SUCCESS",
            payload: data.message
        })
        
    } catch (error) {
        dispatch({
            type: "LOGOUT_USER_FAILURE",
            payload: error.response?.data?.message
        })
    }
}

export const getAllOtherUsers = () => async (dispatch) => {
    try {
        dispatch({
            type: "GET_ALL_OTHER_USERS_REQUEST"
        })

        const { data } = await axios.get(`${URL}/others`);

        dispatch({
            type: "GET_ALL_OTHER_USERS_SUCCESS",
            payload: data.data
        })
        
    } catch (error) {
        dispatch({
            type: "GET_ALL_OTHER_USERS_FAILURE",
            payload: error.response?.data?.message
        })
    }
}

export const getUser = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "GET_USER_REQUEST"
        })

        const { data } = await axios.get(`${URL}/${id}`);

        dispatch({
            type: "GET_USER_SUCCESS",
            payload: data.data
        })
        
    } catch (error) {
        dispatch({
            type: "GET_USER_FAILURE",
            payload: error?.response?.data?.message
        })
    }
}

export const followUser = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "FOLLOW_USER_REQUEST"
        })

        const { data } = await axios.get(`${URL}/follow/${id}`);

        dispatch({
            type: "FOLLOW_USER_SUCCESS",
            payload: data.message
        })
        
    } catch (error) {
        dispatch({
            type: "FOLLOW_USER_FAILURE",
            payload: error?.response?.data?.message
        })
    }
}

export const unfollowUser = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "UNFOLLOW_USER_REQUEST"
        })

        const { data } = await axios.get(`${URL}/unfollow/${id}`); 

        dispatch({
            type: "UNFOLLOW_USER_SUCCESS",
            payload: data.message
        })
        
    } catch (error) {
        dispatch({
            type: "UNFOLLOW_USER_FAILURE",
            payload: error?.response?.data?.message
        })
    }
}

export const updateProfile = (user) => async (dispatch) => {
    try {
        dispatch({
            type: "UPDATE_PROFILE_REQUEST"
        })

        const { data } = await axios.patch(`${URL}/update/profile`, user, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        dispatch({
            type: "UPDATE_PROFILE_SUCCESS",
            payload: data.message
        })
        
    } catch (error) {
        dispatch({
            type: "UPDATE_PROFILE_FAILURE",
            payload: error?.response?.data?.message
        })
    }
}

export const updatePassword = (passDetails) => async (dispatch) => {
    try {
        dispatch({
            type: "UPDATE_PASSWORD_REQUEST"
        })

        const { data } = await axios.patch(`${URL}/update/password`, passDetails, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        dispatch({
            type: "UPDATE_PASSWORD_SUCCESS",
            payload: data.message
        })
        
    } catch (error) {
        dispatch({
            type: "UPDATE_PASSWORD_FAILURE",
            payload: error?.response?.data?.message
        })
    }
}

export const myNotifications = () => async (dispatch) => {
    try {
        dispatch({
            type: "MY_NOTIFICATIONS_REQUEST"
        })

        const { data } = await axios.get(`${URL}/notifications/my`);

        dispatch({
            type: "MY_NOTIFICATIONS_SUCCESS",
            payload: data.data
        })
        
    } catch (error) {
        dispatch({
            type: "MY_NOTIFICATIONS_FAILURE",
            payload: error?.response?.data?.message
        })
    }
}