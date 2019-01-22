const express = require("express")
const router = express.Router()
const mongooose = require("mongoose")
const passport = require("passport")
const Post = require("../../models/Post")
const Profile = require("../../models/Profile")
const User = require("../../models/User")
const validatePostInput = require("../../validation/post")
const validateCommentInput = require("../../validation/comment")



//@route     GET api/posts/test
//@desc      Tests posts route
//@access    Public
router.get("/test", (req, res) => res.json({ msg: "Posts works" }))



//2@route    GET api/posts
//@desc      Get posts
//@access    Public  
router.get("/", (req, res) => {
  const errors = {}

  Post.find()
    .sort({ date: -1 })
    .then(posts => {
      if (!posts) {
        errors.nopost = "Posts not found"
        res.status(404).json(errors)
      }
      res.json(posts)
    })
    .catch(err => res.status(404).json("Posts not found"))
})



//3@route    GET api/posts/:id
//@desc      Get post by id
//@access    Public 
router.get("/:id", (req, res) => {
  const errors = {};

  Post.findById(req.params.id)
    .then(post => {
      if (!post) {
        errors.nopost = "Post not found"
        res.status(404).json(errors)
      }
      res.json(post)
    })
    .catch(err => res.status(404).json("Post not found"))
})


//1@route    POST api/posts
//@desc      Create post
//@access    Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body)

    //check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      name: req.user.name,
      avatar: req.user.avatar,
      user: req.user.id,
      text: req.body.text,
      handle: req.body.handle
    })

    newPost.save().then(post => res.json(post))
  }
)



//4@route    DELETE api/posts/:post_id
//@desc      Delete post
//@access    Private
router.delete(
  "/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {

    Profile
      .findOne({ user: req.user.id }).then(profile => {
        // Find post
        Post
          .findById(req.params.post_id)
          .then(post => {
            if (post.user.toString() !== req.user.id) {
              return res.status(401).json({ notauthorizeid: "User not authorizeid" })
            }
            // Delete
            post.remove().then(() => res.json({ success: true }))
          })
          .catch(err => res.status(404).json({ postnotfound: "Post not found" }))
      })
  }
)



//5@route    POST api/posts/like/:post_id
//@desc      Like post
//@access    Private
router.post(
  "/like/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Find profile
    Profile
      .findOne({ user: req.user.id }).then(() => {
        // Find post
        Post
          .findById(req.params.post_id)
          .then(post => {
            if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
              return res.status(400).json({ alreadyliked: "User already liked this post" })
            }
            post.likes.push({ user: req.user.id })
            post.save().then(post => res.json(post))
          })
          .catch(err => res.status(404).json({ postnotfound: "Post not found" }))
      })
  }
)



//6@route    POST api/posts/unlike/:post_id
//@desc      Unlike post
//@access    Private
router.post("/unlike/:post_id", passport.authenticate("jwt", { session: false }), (req, res) => {
  Profile
    .findOne({ user: req.user.id }).then(() => {
      // Find post
      Post
        .findById(req.params.post_id)
        .then(post => {
          if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ notliked: "You have not liked this post yet" })
          }
          const newPostArr = post.likes.filter(like => like.id === req.params.post_id)
          post.likes = newPostArr
          //Save
          post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({ postnotfound: "Post not found" }))
    })
})



//7@route    POST api/posts/comment/:post_id
//@desc      Comment post
//@access    Private
router.post("/comment/:post_id", passport.authenticate("jwt", { session: false }), (req, res) => {
  const { errors, isValid } = validateCommentInput(req.body)

  //check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Post
    .findById(req.params.post_id)
    .then(post => {
      if (!post) {
        errors.nopost = "No post found"
        res.status(404).json(errors)
      }

      const newComment = {
        text: req.body.text,
        name: req.user.name,
        avatar: req.user.avatar,
        user: req.user.id,
        handle: req.body.handle
      }
      //add to comments array
      post.comments.unshift(newComment)
      //Save
      post.save().then(post => res.json(post))
    })
    .catch(err => res.status(404).json(err))
})



//8@route    DELETE api/posts/comment/:post_id/:comment_id
//@desc      Delete comment 
//@access    Private
router.delete(
  '/comment/:post_id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.post_id)
      .then(post => {
        // Check to see if comment exists
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: 'Comment does not exist' })
        }
        // Get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id)
        // Splice comment out of array
        post.comments.splice(removeIndex, 1)
        // save
        post.save().then(post => res.json(post))
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }))
  }
)


module.exports = router


