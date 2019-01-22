const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const passport = require("passport")
const User = require("../../models/User")
const Profile = require("../../models/Profile")
const validateProfileInput = require("../../validation/profile")
const validateExperienceInput = require("../../validation/experience")
const validateEducationInput = require("../../validation/education")
const githubClientId = require("../../config/keys").githubClientId
const githubClientSecret = require("../../config/keys").githubClientSecret
const axios = require("axios")



//@route     GET api/profile/test
//@desc      Tests profile route
//@access    Public
router.get("/test", (req, res) => res.json({ msg: "Profile works" }))



//@route     GET api/profile
//@desc      Get current user profile
//@access    Private
router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  const errors = {}

  Profile
    .findOne({ user: req.user.id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "Profile not found"
        return res.status(404).json(errors);
      }
      res.json(profile)
    })
    .catch(err => res.status(404).json(err))
})



//@route     GET api/profile/handle/:handle
//@desc      Get profile by handle
//@access    Public
router.get("/handle/:handle", (req, res) => {
  const errors = {}

  Profile
    .findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "Profile not found"
        res.status(404).json(errors)
      }
      res.json(profile)
    })
    .catch(err => res.json(err))
})



//@route     GET api/profile/user/:user_id
//@desc      Get profile by user ID
//@access    Public
router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Profile
    .findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "Profile not found"
        res.status(404).json(errors)
      }
      res.json(profile)
    })
    .catch(err =>
      res.status(404).json({ profile: "There is no profile for this user" })
    )
})



//@route     GET api/profile/all
//@desc      Get all profiles
//@access    Public
router.get("/all", (req, res) => {
  const errors = {};
  Profile
    .find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "Profiles not found"
        res.status(404).json(errors)
      }
      res.json(profiles)
    })
    .catch(err => res.status(404).json({ profile: "There is no profiles" }))
})



// @route       GET api/profile/github/:username/:count/:sort
// @desc        Get github data from github api
// @access      Public
router.get("/github/:githubusername", (req, res) => {
  const githubusername = req.params.githubusername
  const count = 5
  const sort = "created: asc"
  const clientId = githubClientId
  const clientSecret = githubClientSecret

  // axios request for 5 repositories from github user
  axios
    .get(`https://api.github.com/users/${githubusername}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`)
    .then(data => {
      repos = data.data
      //console.log(repos)
      res.json({ repos })
    })
    .catch(err => res.json(err))
})



//@route     POST api/profile
//@desc      Create or edit user profile / this is also be where we update profile
//@access    Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body)

    //check validation
    if (!isValid) {
      return res.status(400).json(errors)
    }

    const profileFields = {}
    profileFields.user = req.user.id

    if (req.body.handle) profileFields.handle = req.body.handle
    req.body.company ? profileFields.company = req.body.company : profileFields.company = ''
    req.body.website ? profileFields.website = req.body.website : profileFields.website = ''
    req.body.location ? profileFields.location = req.body.location : profileFields.location = ''
    req.body.bio ? profileFields.bio = req.body.bio : profileFields.bio = ''
    if (req.body.status) profileFields.status = req.body.status
    req.body.githubusername ? profileFields.githubusername = req.body.githubusername : profileFields.githubusername = ''
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",")
    }
    // Social
    profileFields.social = {}
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram

    // Find logged in user
    Profile
      .findOne({ user: req.user.id }).then(profile => {
        // Update profile
        if (profile) {
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          )
            .then(profile => res.json(profile))
        }
        // Create profile
        else {
          Profile
            .findOne({ handle: profileFields.handle })
            .then(profile => {
              if (profile) {
                errors.handle = "Handle already exists"
                res.status(400).json(errors)
              }
              new Profile(profileFields).save().then(profile => res.json(profile))
            })
        }
      })
  }
)



//@route     POST api/profile/experience
//@desc      Add experience to profile
//@access    Private 
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body)

    //check validation
    if (!isValid) {
      return res.status(400).json(errors)
    }

    Profile
      .findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "Profile not found"
          res.status(404).json(errors)
        }

        const newExp = {
          title: req.body.title,
          company: req.body.company,
          location: req.body.location,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        }

        profile.experience.unshift(newExp)
        profile.save().then(profile => res.json(profile))
      })
      .catch(err => res.status(404).json(err))
  }
)



//@route     POST api/profile/education
//@desc      Add education to profile
//@access    Private 
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body)

    //check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    //we want to find by logged in user so
    Profile
      .findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "Profile not found"
          res.status(404).json(errors)
        }

        const newEdu = {
          school: req.body.school,
          degree: req.body.degree,
          fieldofstudy: req.body.fieldofstudy,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        }

        profile.education.unshift(newEdu)

        profile.save().then(profile => res.json(profile))
      })
      .catch(err => res.status(404).json(err))
  }
)

//@route     DELETE api/profile/experience/exp_id
//@desc      Delete experience from profile
//@access    Private 
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //we want to find by logged in user so
    Profile
      .findOne({ user: req.user.id })
      .then(profile => {
        const newExpArr = profile.experience.filter(
          item => !(item.id === req.params.exp_id)
        )
        //then we set new array
        profile.experience = newExpArr
        //Save
        profile.save().then(profile => res.json(profile))
      })
      .catch(err => res.status(404).json(err))
  }
)



//@route     DELETE api/profile/education/edu_id
//@desc      Delete education from profile
//@access    Private 
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {

    Profile
      .findOne({ user: req.user.id })
      .then(profile => {
        const newEduArr = profile.education.filter(
          item => !(item.id === req.params.edu_id)
        )
        profile.education = newEduArr
        //save
        profile.save().then(profile => res.json(profile))
      })
      .catch(err => res.status(404).json(err))
  }
)



//@route     DELETE api/profile
//@desc      Delete user and profile
//@access    Private 
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Remove Profile
    Profile
      .findOneAndRemove({ user: req.user.id })
      .then(() => {
        //Remove User
        User
          .findOneAndRemove({ _id: req.user.id })
          .then(() => res.json({ success: true }))
      })
      .catch(err => res.json(err))
  }
)


module.exports = router
