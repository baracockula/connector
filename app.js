const express = require("express")
const app = express()
const path = require("path")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const db = require("./config/keys").mongoURL
const passport = require("passport")
const users = require("./routes/api/users")
const profile = require("./routes/api/profile")
const posts = require("./routes/api/posts")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Connect to MongoDB through mongoose
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err))

// Passport middleware
app.use(passport.initialize())

// Passport config 
require("./config/passport")(passport)

// Use Routes
app.use("/api/users", users)
app.use("/api/profile", profile)
app.use("/api/posts", posts)

// Server static assets if in production
if (process.env.NODE_ENV === "production") {
  // if in production - Set static folder:
  app.use(express.static("client/build"))
  // create route for it
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  })
}

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server running on port ${port}`))
