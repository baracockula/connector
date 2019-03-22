# connector

Small social network app built with the MERN stack.

User can sign up, create profile make posts and leave comments.

You can edit your profile, add education and experience and make your profile and skill set 
or even your github repo visible to other developers that use this app.

This is small app that uses React framework and Redux arhitecture and it runs react web server on client side
and Node.js with Express.js framework on server side.
Database is set up on mlab cloud service that hosts mongoDB database.


# QUICK START:

Install dependencies for server
$ npm install

Install dependencies for client
$ npm run client-install

Run the client & server with concurrently
$ npm run dev

Run the Express server only
$ npm run server

Run the React client only
$ npm run client

Server runs on http://localhost:5000 and client on http://localhost:3000


You will need to create a keys_dev.js in the server config folder with

module.exports = {
  mongoURI: 'YOUR_OWN_MONGO_URI',
  secretOrKey: 'YOUR_OWN_SECRET'
};
 







