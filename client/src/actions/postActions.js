import axios from "axios"
import { ADD_POST, GET_ERRORS, GET_POSTS, POST_LOADING, DELETE_POST, GET_POST, CLEAR_ERRORS } from "./types"


// Add post
export const addPost = (postData) => dispatch => {
  dispatch(clearErrors())
  axios
    .post("/api/posts", postData)
    .then(res =>
      dispatch({
        type: ADD_POST,
        payload: res.data
      }))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
}


// Get posts
export const getPosts = () => dispatch => {
  dispatch(setPostLoading())
  axios
    .get("/api/posts")
    .then(res =>
      dispatch({
        type: GET_POSTS,
        payload: res.data
      }))
    .catch(err =>
      dispatch({
        type: GET_POSTS,
        payload: null
      })
    );
}


// Delete post
export const deletePost = (id) => dispatch => {
  axios
    .delete(`/api/posts/${id}`)
    .then(res =>
      dispatch({
        type: DELETE_POST,
        payload: id
      }))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
}


// Add like
export const addLike = (id) => dispatch => {
  axios
    .post(`/api/posts/like/${id}`)
    .then(res => dispatch(getPosts()))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
}


// Remove like
export const removeLike = (id) => dispatch => {
  axios
    .post(`/api/posts/unlike/${id}`)
    .then(res => dispatch(getPosts()))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
}


// Get post
export const getPost = id => dispatch => {
  dispatch(setPostLoading())
  axios
    .get(`/api/posts/${id}`)
    .then(res =>
      dispatch({
        type: GET_POST,
        payload: res.data
      }))
    .catch(err =>
      dispatch({
        type: GET_POST,
        payload: null
      })
    );
}


// Add comment
export const addComment = (post_id, postData) => dispatch => {
  dispatch(clearErrors())
  axios
    .post(`/api/posts/comment/${post_id}`, postData)
    .then(res => dispatch({
      type: GET_POST,
      payload: res.data
    }))
    .catch(err => dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    }))
}


// Delete comment
export const deleteComment = (post_id, comment_id) => dispatch => {
  axios
    .delete(`/api/posts/comment/${post_id}/${comment_id}`)
    .then(res => dispatch({
      type: GET_POST,
      payload: res.data
    }))
    .catch(err => dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    }))
}


// Set post loading
export const setPostLoading = () => {
  return {
    type: POST_LOADING
  }
}


// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  }
}

