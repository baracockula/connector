import React, { Component } from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { Provider } from "react-redux"
import store from "./store"
import jwt_decode from "jwt-decode"
import setAuthToken from "./utils/setAuthToken"
import { setCurrentUser, logoutUser } from "./actions/authActions"

import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import Landing from "./components/layout/Landing"
import Register from "./components/auth/Register"
import Login from "./components/auth/Login"
import Dashboard from "./components/dashboard/Dashboard"
import CreateProfile from "./components/create-profile/CreateProfile"
import EditProfile from "./components/edit-profile/EditProfile"
import AddExperience from "./components/add-credentials/AddExperience"
import AddEducation from "./components/add-credentials/AddEducation"
import Profiles from "./components/profiles/Profiles"
import Profile from "./components/profile/Profile"
import Posts from "./components/posts/Posts"
import Post from "./components/post/Post"

import NotFound from "./components/not-found/NotFound"

import PrivateRoute from "./components/common/PrivateRoute"

import { clearCurrentProfile } from "./actions/profileActions"
import "./App.css";


// Check for token
if (localStorage.jwtToken) {
  //set auth token header auth
  setAuthToken(localStorage.jwtToken)
  //decode token and get user information and expiration
  const decoded = jwt_decode(localStorage.jwtToken)
  //set user and is.Authenticated 
  store.dispatch(setCurrentUser(decoded))
  // Check for expired token
  const currentTime = Date.now() / 1000
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser())
    // Clear current profile
    store.dispatch(clearCurrentProfile())
    // Redirect to login
    window.location.href = "/login"
  }
}


class App extends Component {

  render() {

    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="container">
              <Switch>
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/profiles" component={Profiles} />
                <Route exact path="/profile/:handle" component={Profile} />
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRoute exact path="/create-profile" component={CreateProfile} />
                <PrivateRoute exact path="/edit-profile" component={EditProfile} />
                <PrivateRoute exact path="/add-experience" component={AddExperience} />
                <PrivateRoute exact path="/add-education" component={AddEducation} />
                <PrivateRoute exact path="/feed" component={Posts} />
                <PrivateRoute exact path="/post/:post_id" component={Post} />
                <Route exact path="/not-found" component={NotFound} />
              </Switch>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}


export default App;
