import { createAction, createReducer } from '@reduxjs/toolkit';

const initialState = {

}

const userLoginRequest = createAction('USER_LOGIN_REQUEST');
const userLoginSuccess = createAction('USER_LOGIN_SUCCESS');
const userLoginFailure = createAction('USER_LOGIN_FAILURE');

const userRegisterRequest = createAction('USER_REGISTER_REQUEST');
const userRegisterSuccess = createAction('USER_REGISTER_SUCCESS');
const userRegisterFailure = createAction('USER_REGISTER_FAILURE');

const loginOtpRequest = createAction('LOGIN_OTP_REQUEST');
const loginOtpSuccess = createAction('LOGIN_OTP_SUCCESS');
const loginOtpFailure = createAction('LOGIN_OTP_FAILURE');

const verifyOtpRequest = createAction('VERIFY_OTP_REQUEST');
const verifyOtpSuccess = createAction('VERIFY_OTP_SUCCESS');
const verifyOtpFailure = createAction('VERIFY_OTP_FAILURE');

const resendLoginOtpRequest = createAction('RESEND_LOGIN_OTP_REQUEST');
const resendLoginOtpSuccess = createAction('RESEND_LOGIN_OTP_SUCCESS');
const resendLoginOtpFailure = createAction('RESEND_LOGIN_OTP_FAILURE');

const resendVerifyOtpRequest = createAction('RESEND_VERIFY_OTP_REQUEST');
const resendVerifyOtpSuccess = createAction('RESEND_VERIFY_OTP_SUCCESS');
const resendVerifyOtpFailure = createAction('RESEND_VERIFY_OTP_FAILURE');

const loadUserRequest = createAction('LOAD_USER_REQUEST');
const loadUserSuccess = createAction('LOAD_USER_SUCCESS');
const loadUserFailure = createAction('LOAD_USER_FAILURE');

const logoutUserRequest = createAction('LOGOUT_USER_REQUEST');
const logoutUserSuccess = createAction('LOGOUT_USER_SUCCESS');
const logoutUserFailure = createAction('LOGOUT_USER_FAILURE');

const getAllOtherUsersRequest = createAction('GET_ALL_OTHER_USERS_REQUEST');
const getAllOtherUsersSuccess = createAction('GET_ALL_OTHER_USERS_SUCCESS');
const getAllOtherUsersFailure = createAction('GET_ALL_OTHER_USERS_FAILURE');

const getUserRequest = createAction('GET_USER_REQUEST');
const getUserSuccess = createAction('GET_USER_SUCCESS');
const getUserFailure = createAction('GET_USER_FAILURE');

const followUserRequest = createAction('FOLLOW_USER_REQUEST');
const followUserSuccess = createAction('FOLLOW_USER_SUCCESS');
const followUserFailure = createAction('FOLLOW_USER_FAILURE');

const unfollowUserRequest = createAction('UNFOLLOW_USER_REQUEST');
const unfollowUserSuccess = createAction('UNFOLLOW_USER_SUCCESS');
const unfollowUserFailure = createAction('UNFOLLOW_USER_FAILURE');

const updateProfileRequest = createAction('UPDATE_PROFILE_REQUEST');
const updateProfileSuccess = createAction('UPDATE_PROFILE_SUCCESS');
const updateProfileFailure = createAction('UPDATE_PROFILE_FAILURE');

const updatePasswordRequest = createAction('UPDATE_PASSWORD_REQUEST');
const updatePasswordSuccess = createAction('UPDATE_PASSWORD_SUCCESS');
const updatePasswordFailure = createAction('UPDATE_PASSWORD_FAILURE');

const getMyNotificationsRequest = createAction('MY_NOTIFICATIONS_REQUEST');
const getMyNotificationsSuccess = createAction('MY_NOTIFICATIONS_SUCCESS');
const getMyNotificationsFailure = createAction('MY_NOTIFICATIONS_FAILURE');

const clearError = createAction('CLEAR_ERROR');
const clearAuthError = createAction('CLEAR_AUTH_ERROR');
const clearMessage = createAction('CLEAR_MESSAGE');
const clearLogoutMessage = createAction('CLEAR_LOGOUT_MESSAGE');

export const userAuthReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(userLoginRequest, (state) => {
            state.loading = true;
        })
        .addCase(userLoginSuccess, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
            state.id = action.payload.id;
        })
        .addCase(userLoginFailure, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(loginOtpRequest, (state) => {
            state.loading = true;
        })
        .addCase(loginOtpSuccess, (state, action) => {
            state.loading = false;
            state.message = action.payload;
            state.isAuthenticated = true;
        })
        .addCase(loginOtpFailure, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        })
        .addCase(userRegisterRequest, (state) => {
            state.loading = true;
        })
        .addCase(userRegisterSuccess, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
            state.id = action.payload.id;
        })
        .addCase(userRegisterFailure, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(verifyOtpRequest, (state) => {
            state.loading = true;
        })
        .addCase(verifyOtpSuccess, (state, action) => {
            state.loading = false;
            state.message = action.payload;
            state.isAuthenticated = true;
        })
        .addCase(verifyOtpFailure, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        })
        .addCase(resendLoginOtpRequest, (state) => {
            state.loading = true;
        })
        .addCase(resendLoginOtpSuccess, (state, action) => {
            state.loading = false;
            state.message = action.payload;
        })
        .addCase(resendLoginOtpFailure, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(resendVerifyOtpRequest, (state) => {
            state.loading = true;
        })
        .addCase(resendVerifyOtpSuccess, (state, action) => {
            state.loading = false;
            state.message = action.payload;
        })
        .addCase(resendVerifyOtpFailure, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(loadUserRequest, (state) => {
            state.userLoading = true;
        })
        .addCase(loadUserSuccess, (state, action) => {
            state.userLoading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
        })
        .addCase(loadUserFailure, (state, action) => {
            state.userLoading = false;
            state.authError = action.payload;
            state.isAuthenticated = false;
        })
        .addCase(logoutUserRequest, (state) => {
            state.userLoading = true;
        })
        .addCase(logoutUserSuccess, (state, action) => {
            state.userLoading = false;
            state.logoutMessage = action.payload;
            state.isAuthenticated = false;
        })
        .addCase(logoutUserFailure, (state, action) => {
            state.userLoading = false;
            state.error = action.payload;
        })
        .addCase(clearError, (state) => {
            state.error = null;
        })
        .addCase(clearAuthError, (state) => {
            state.authError = null;
        })
        .addCase(clearMessage, (state) => {
            state.message = null;
        })
        .addCase(clearLogoutMessage, (state) => {
            state.logoutMessage = null;
        })
})

export const getAllOtherUsers = createReducer(initialState, (builder) => {
    builder
        .addCase(getAllOtherUsersRequest, (state) => {
            state.loading = true;
        })
        .addCase(getAllOtherUsersSuccess, (state, action) => {
            state.loading = false;
            state.users = action.payload;
        })
        .addCase(getAllOtherUsersFailure, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(clearError, (state) => {
            state.error = null;
        })
})

export const getUserReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(getUserRequest, (state) => {
            state.loading = true;
        })
        .addCase(getUserSuccess, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(getUserFailure, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(clearError, (state) => {
            state.error = null;
        })
})

export const followAndUnfollowUserReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(followUserRequest, (state) => {
            state.loading = true;
        })
        .addCase(followUserSuccess, (state, action) => {
            state.loading = false;
            state.message = action.payload;
        })
        .addCase(followUserFailure, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(unfollowUserRequest, (state) => {
            state.loading = true;
        })
        .addCase(unfollowUserSuccess, (state, action) => {
            state.loading = false;
            state.message = action.payload;
        })
        .addCase(unfollowUserFailure, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(clearError, (state) => {
            state.error = null;
        })
        .addCase(clearMessage, (state) => {
            state.message = null;
        })
})

export const updateUserReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(updateProfileRequest, (state) => {
            state.loading = true;
        })
        .addCase(updateProfileSuccess, (state, action) => {
            state.loading = false;
            state.message = action.payload;
        })
        .addCase(updateProfileFailure, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(updatePasswordRequest, (state) => {
            state.passLoading = true;
        })
        .addCase(updatePasswordSuccess, (state, action) => {
            state.passLoading = false;
            state.message = action.payload;
        })
        .addCase(updatePasswordFailure, (state, action) => {
            state.passLoading = false;
            state.error = action.payload;
        })
        .addCase(clearError, (state) => {
            state.error = null;
        })
        .addCase(clearMessage, (state) => {
            state.message = null;
        })
})

export const myNotificationsReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(getMyNotificationsRequest, (state) => {
            state.loading = true;
        })
        .addCase(getMyNotificationsSuccess, (state, action) => {
            state.loading = false;
            state.notifications = action.payload;
        })
        .addCase(getMyNotificationsFailure, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(clearError, (state) => {
            state.error = null;
        })
})