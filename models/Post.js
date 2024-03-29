const mongoose = require("mongoose")
const Schema = mongoose.Schema


const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  handle: {
    type: String,
    max: 40
  },
  text: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  name: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      handle: {
        type: String,
        max: 40
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]
});


module.exports = Post = mongoose.model("post", PostSchema)
