import axios from "axios"
import setAuthToken from "../utils/setAuthToken"
import jwt_decode from "jwt-decode"
import { GET_ERRORS, SET_CURRENT_USER } from "./types"


// Register user
export const registerUser = (userdata, history) => dispatch => {
  axios
    .post("/api/users/register", userdata)
    .then(res => history.push("/login"))
    .catch(err => dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    }))
}


// Login User
export const loginUser = userdata => dispatch => {
  axios
    .post("/api/users/login", userdata)
    .then(res => {
      // save to localStorage
      const { token } = res.data
      //set token to localStorage
      localStorage.setItem("jwtToken", token)
      //set token to Auth header
      setAuthToken(token)
      // Decode token to get user data
      const decoded = jwt_decode(token)
      // Set current user 
      dispatch(setCurrentUser(decoded))
    })
    .catch(err => dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    }))
}


// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
}


// Logout User
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem("jwtToken")
  // Remove auth header for future requests 
  setAuthToken(false)
  dispatch(setCurrentUser({}))
}

