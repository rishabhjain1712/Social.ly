import { createAction, createReducer } from '@reduxjs/toolkit';

const initialState = {

}

const createChatRequest = createAction('CREATE_CHAT_REQUEST');
const createChatSuccess = createAction('CREATE_CHAT_SUCCESS');
const createChatFailure = createAction('CREATE_CHAT_FAILURE');

const getUserChatsRequest = createAction('GET_USER_CHATS_REQUEST');
const getUserChatsSuccess = createAction('GET_USER_CHATS_SUCCESS');
const getUserChatsFailure = createAction('GET_USER_CHATS_FAILURE');

const clearError = createAction('CLEAR_ERROR');
const clearMessage = createAction('CLEAR_MESSAGE');

export const chatReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(createChatRequest, (state) => {
            state.loading = true;
        })
        .addCase(createChatSuccess, (state, action) => {
            state.loading = false;
            state.message = action.payload;
        })
        .addCase(createChatFailure, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(getUserChatsRequest, (state) => {
            state.loading = true;
        })
        .addCase(getUserChatsSuccess, (state, action) => {
            state.loading = false;
            state.chat = action.payload;
        })
        .addCase(getUserChatsFailure, (state, action) => {
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