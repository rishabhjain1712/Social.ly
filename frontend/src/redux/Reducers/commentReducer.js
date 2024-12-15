import { createAction, createReducer } from '@reduxjs/toolkit'

const initialState = {

}

const addCommentRequest = createAction('ADD_COMMENT_REQUEST');
const addCommentSuccess = createAction('ADD_COMMENT_SUCCESS');
const addCommentFailure = createAction('ADD_COMMENT_FAILURE');

const getPostCommentsRequest = createAction('GET_POST_COMMENTS_REQUEST');
const getPostCommentsSuccess = createAction('GET_POST_COMMENTS_SUCCESS');
const getPostCommentsFailure = createAction('GET_POST_COMMENTS_FAILURE');

const likeAndUnlikeCommentRequest = createAction('LIKE_AND_UNLIKE_COMMENT_REQUEST');
const likeAndUnlikeCommentSuccess = createAction('LIKE_AND_UNLIKE_COMMENT_SUCCESS');
const likeAndUnlikeCommentFailure = createAction('LIKE_AND_UNLIKE_COMMENT_FAILURE');

const updateCommentRequest = createAction('UPDATE_COMMENT_REQUEST');
const updateCommentSuccess = createAction('UPDATE_COMMENT_SUCCESS');
const updateCommentFailure = createAction('UPDATE_COMMENT_FAILURE');

const deleteCommentRequest = createAction('DELETE_COMMENT_REQUEST');
const deleteCommentSuccess = createAction('DELETE_COMMENT_SUCCESS');
const deleteCommentFailure = createAction('DELETE_COMMENT_FAILURE');

const addReplyRequest = createAction('ADD_REPLY_REQUEST');
const addReplySuccess = createAction('ADD_REPLY_SUCCESS');
const addReplyFailure = createAction('ADD_REPLY_FAILURE');

const likeAndUnlikeReplyRequest = createAction('LIKE_AND_UNLIKE_REPLY_REQUEST');
const likeAndUnlikeReplySuccess = createAction('LIKE_AND_UNLIKE_REPLY_SUCCESS');
const likeAndUnlikeReplyFailure = createAction('LIKE_AND_UNLIKE_REPLY_FAILURE');

const updateReplyRequest = createAction('UPDATE_REPLY_REQUEST');
const updateReplySuccess = createAction('UPDATE_REPLY_SUCCESS');
const updateReplyFailure = createAction('UPDATE_REPLY_FAILURE');

const deleteReplyRequest = createAction('DELETE_REPLY_REQUEST');
const deleteReplySuccess = createAction('DELETE_REPLY_SUCCESS');
const deleteReplyFailure = createAction('DELETE_REPLY_FAILURE');

const clearError = createAction('CLEAR_ERROR');
const clearMessage = createAction('CLEAR_MESSAGE');

export const commentReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(addCommentRequest, (state) => {
            state.loading = true;
        })
        .addCase(addCommentSuccess, (state, action) => {
            state.loading = false;
            state.message = action.payload;
        })
        .addCase(addCommentFailure, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(likeAndUnlikeCommentRequest, (state) => {
            state.loading = true;
        })
        .addCase(likeAndUnlikeCommentSuccess, (state, action) => {
            state.loading = false;
            state.message = action.payload;
        })
        .addCase(likeAndUnlikeCommentFailure, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(updateCommentRequest, (state) => {
            state.loading = true;
        })
        .addCase(updateCommentSuccess, (state, action) => {
            state.loading = false;
            state.message = action.payload;
        })
        .addCase(updateCommentFailure, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(deleteCommentRequest, (state) => {
            state.loading = true;
        })
        .addCase(deleteCommentSuccess, (state, action) => {
            state.loading = false;
            state.message = action.payload;
        })
        .addCase(deleteCommentFailure, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(getPostCommentsRequest, (state) => {
            state.loading = true;
        })
        .addCase(getPostCommentsSuccess, (state, action) => {
            state.loading = false;
            state.comments = action.payload;
        })
        .addCase(getPostCommentsFailure, (state, action) => {
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

export const replyReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(addReplyRequest, (state) => {
            state.loading = true;
        })
        .addCase(addReplySuccess, (state, action) => {
            state.loading = false;
            state.message = action.payload;
        })
        .addCase(addReplyFailure, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(likeAndUnlikeReplyRequest, (state) => {
            state.loading = true;
        })
        .addCase(likeAndUnlikeReplySuccess, (state, action) => {
            state.loading = false;
            state.message = action.payload;
        })
        .addCase(likeAndUnlikeReplyFailure, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(updateReplyRequest, (state) => {
            state.loading = true;
        })
        .addCase(updateReplySuccess, (state, action) => {
            state.loading = false;
            state.message = action.payload;
        })
        .addCase(updateReplyFailure, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(deleteReplyRequest, (state) => {
            state.loading = true;
        })
        .addCase(deleteReplySuccess, (state, action) => {
            state.loading = false;
            state.message = action.payload;
        })
        .addCase(deleteReplyFailure, (state, action) => {
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