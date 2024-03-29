import axios from "axios"
import { GET_PROFILE, PROFILE_LOADING, CLEAR_CURRENT_PROFILE, GET_ERRORS, SET_CURRENT_USER, GET_PROFILES } from "./types"


export const getCurrentProfile = () => dispatch => {
  //set loading state 
  dispatch(setProfileLoading())
  axios
    .get("/api/profile")
    .then(res => {
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    })
    .catch(err => {
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    })
}


// Get profile by handle
export const getProfileByHandle = handle => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get(`/api/profile/handle/${handle}`)
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: null
      })
    );
};


// Get All profiles
export const getProfiles = () => dispatch => {
  //set loading state 
  dispatch(setProfileLoading())
  axios
    .get("/api/profile/all")
    .then(res => dispatch({
      type: GET_PROFILES,
      payload: res.data
    }))
    .catch(err =>
      dispatch({
        type: GET_PROFILES,
        payload: null
      })
    );
}


// Create profile
export const createProfile = (profileData, history) => dispatch => {
  axios
    .post("/api/profile", profileData)
    .then(res => history.push("/dashboard"))
    .catch(err => dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    }))
}


// Add experience
export const addExperience = (expData, history) => dispatch => {
  axios
    .post('/api/profile/experience', expData)
    .then(res => history.push('/dashboard'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};


// Add education
export const addEducation = (eduData, history) => dispatch => {
  axios
    .post('/api/profile/education', eduData)
    .then(res => history.push('/dashboard'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};


// Delete experience
export const deleteExperience = id => dispatch => {
  axios
    .delete(`/api/profile/experience/${id}`)
    .then(res => dispatch({
      type: GET_PROFILE,
      payload: res.data
    }))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
}


// Delete education
export const deleteEducation = id => dispatch => {
  axios
    .delete(`/api/profile/education/${id}`)
    .then(res => dispatch({
      type: GET_PROFILE,
      payload: res.data
    }))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
}


// Delete account and profile 
export const deleteAccount = () => dispatch => {
  if (window.confirm("Are you sure? This can NOT be undone!")) {
    axios
      .delete("/api/profile")
      .then(res => dispatch({
        type: SET_CURRENT_USER,
        payload: {}
      }))
      .catch(err => dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      }))
  }
}


// Set profile loading 
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  }
}


// Clear profile after we logout 
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE,
    payload: null
  }
}


