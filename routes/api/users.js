const express = require("express")
const router = express.Router()
const User = require("../../models/User")
const gravatar = require("gravatar")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const keys = require("../../config/keys")
const passport = require("passport")
const validateRegisterInput = require("../../validation/register")
const validateLoginInput = require("../../validation/login")



//@route     GET api/users/test
//@desc      Tests users route
//@access    Public
router.get("/test", (req, res) => res.json({ msg: "Users works" }))



//@route     POST api/users/register
//@desc      Register user
//@access    Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body)

  //Check validation
  if (!isValid) {
    return res.status(400).json(errors)
  }

  User
    .findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        errors.email = "Email allready exist"
        return res.status(400).json(errors)
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: "200", // size
          r: "pg", // rating
          d: "mm" // default - mm is empty user avatar picture
        })
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          avatar: avatar
        })
        // hasing password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err))
          })
        })
      }
    })
})



//@route     POST api/users/login
//@desc      Login user / Returning JWT Token
//@access    Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body)

  //Check validation
  if (!isValid) {
    return res.status(400).json(errors)
  }

  const email = req.body.email
  const password = req.body.password
  User
    .findOne({ email: email })
    .then(user => {
      if (!user) {
        errors.email = "User not found"
        return res.status(400).json(errors)
      }
      // Check for password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          //User matched 
          const payload = {
            id: user.id,
            name: user.name,
            avatar: user.avatar
          };
          // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              })
            }
          )
        } else {
          errors.password = "Password incorrect"
          res.status(400).json(errors)
        }
      })
    })
})



//@route     GET api/users/current
//@desc      Return current user (whoever token belongs to)
//@access    Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user)
  }
)


module.exports = router
