import { createAction, createReducer } from '@reduxjs/toolkit';

const initialState = {

}

const createPostRequest = createAction('CREATE_POST_REQUEST');
const createPostSuccess = createAction('CREATE_POST_SUCCESS');
const createPostFailure = createAction('CREATE_POST_FAILURE');

const getAllPostsRequest = createAction('GET_ALL_POSTS_REQUEST');
const getAllPostsSuccess = createAction('GET_ALL_POSTS_SUCCESS');
const getAllPostsFailure = createAction('GET_ALL_POSTS_FAILURE');

const getPostByIdRequest = createAction('GET_POST_BY_ID_REQUEST');
const getPostByIdSuccess = createAction('GET_POST_BY_ID_SUCCESS');
const getPostByIdFailure = createAction('GET_POST_BY_ID_FAILURE');

const getMyPostsRequest = createAction('GET_MY_POSTS_REQUEST');
const getMyPostsSuccess = createAction('GET_MY_POSTS_SUCCESS');
const getMyPostsFailure = createAction('GET_MY_POSTS_FAILURE');

const getUserPostsRequest = createAction('GET_USER_POSTS_REQUEST');
const getUserPostsSuccess = createAction('GET_USER_POSTS_SUCCESS');
const getUserPostsFailure = createAction('GET_USER_POSTS_FAILURE');

const updatePostRequest = createAction('UPDATE_POST_REQUEST');
const updatePostSuccess = createAction('UPDATE_POST_SUCCESS');
const updatePostFailure = createAction('UPDATE_POST_FAILURE');

const deletePostRequest = createAction('DELETE_POST_REQUEST');
const deletePostSuccess = createAction('DELETE_POST_SUCCESS');
const deletePostFailure = createAction('DELETE_POST_FAILURE');

const likeAndUnlikePostRequest = createAction('LIKE_AND_UNLIKE_POST_REQUEST');
const likeAndUnlikePostSuccess = createAction('LIKE_AND_UNLIKE_POST_SUCCESS');
const likeAndUnlikePostFailure = createAction('LIKE_AND_UNLIKE_POST_FAILURE');

const saveAndUnsavePostRequest = createAction('SAVE_AND_UNSAVE_POST_REQUEST');
const saveAndUnsavePostSuccess = createAction('SAVE_AND_UNSAVE_POST_SUCCESS');
const saveAndUnsavePostFailure = createAction('SAVE_AND_UNSAVE_POST_FAILURE');

const getPostOfFollowingRequest = createAction('GET_POST_OF_FOLLOWING_REQUEST');
const getPostOfFollowingSuccess = createAction('GET_POST_OF_FOLLOWING_SUCCESS');
const getPostOfFollowingFailure = createAction('GET_POST_OF_FOLLOWING_FAILURE');

const clearError = createAction('CLEAR_ERROR');
const clearMessage = createAction('CLEAR_MESSAGE');


export const createPostReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(createPostRequest, (state) => {
            state.loading = true;
        })
        .addCase(createPostSuccess, (state, action) => {
            state.loading = false;
            state.message = action.payload;
        })
        .addCase(createPostFailure, (state, action) => {
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

export const getAllPostsReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(getAllPostsRequest, (state) => {
            state.loading = true;
        })
        .addCase(getAllPostsSuccess, (state, action) => {
            state.loading = false;
            state.posts = action.payload;
        })
        .addCase(getAllPostsFailure, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(clearError, (state) => {
            state.error = null;
        })
})

export const getMyPostsReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(getMyPostsRequest, (state) => {
            state.loading = true;
        })
        .addCase(getMyPostsSuccess, (state, action) => {
            state.loading = false;
            state.posts = action.payload;
        })
        .addCase(getMyPostsFailure, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(clearError, (state) => {
            state.error = null;
        })
})

export const getUserPostsReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(getUserPostsRequest, (state) => {
            state.loading = true;
        })
        .addCase(getUserPostsSuccess, (state, action) => {
            state.loading = false;
            state.posts = action.payload;
        })
        .addCase(getUserPostsFailure, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(clearError, (state) => {
            state.error = null;
        })
})

export const likeAndUnlikePostReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(likeAndUnlikePostRequest, (state) => {
            state.loading = true;
        })
        .addCase(likeAndUnlikePostSuccess, (state, action) => {
            state.loading = false;
            state.message = action.payload;
        })
        .addCase(likeAndUnlikePostFailure, (state, action) => {
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

export const getPostOfFollowingReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(getPostOfFollowingRequest, (state) => {
            state.loading = true;
        })
        .addCase(getPostOfFollowingSuccess, (state, action) => {
            state.loading = false;
            state.posts = action.payload;
        })
        .addCase(getPostOfFollowingFailure, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(clearError, (state) => {
            state.error = null;
        })
})

export const saveAndUnsavePostReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(saveAndUnsavePostRequest, (state) => {
            state.loading = true;
        })
        .addCase(saveAndUnsavePostSuccess, (state, action) => {
            state.loading = false;
            state.message = action.payload;
        })
        .addCase(saveAndUnsavePostFailure, (state, action) => {
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

export const getPostByIdReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(getPostByIdRequest, (state) => {
            state.loading = true;
        })
        .addCase(getPostByIdSuccess, (state, action) => {
            state.loading = false;
            state.post = action.payload;
        })
        .addCase(getPostByIdFailure, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(clearError, (state) => {
            state.error = null;
        })
})

export const updatePostReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(updatePostRequest, (state) => {
            state.loading = true;
        })
        .addCase(updatePostSuccess, (state, action) => {
            state.loading = false;
            state.message = action.payload;
        })
        .addCase(updatePostFailure, (state, action) => {
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

export const deletePostReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(deletePostRequest, (state) => {
            state.loading = true;
        })
        .addCase(deletePostSuccess, (state, action) => {
            state.loading = false;
            state.message = action.payload;
        })
        .addCase(deletePostFailure, (state, action) => {
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