const { request } = require('express');
var express = require('express');
var router = express.Router();
//var Participant = require('../models/Participant');
var posts = require('../models/Posts')
var authService = require('../Services/authService')

// GET ROUTE FOR ALL POSTS
// I used a similar get route as in participants js. however, now
// this get route will be pulling from the posts schema.

router.get('/allPosts', async function (req, res) {
  let token = req.headers.authorization;
  console.log(token)
  authService.verifyParticipant(token).then( async participant => {
    if (participant) {
      try {
        const allPosts = await posts.find();
        console.log(allPosts)
        res.status(200).json({
          data: { allPosts }
        });
      } catch (err) {
        res.status(404).json({
          status: 'fail',
          message: err
        });
      }
    } else {
      return res.json({ message: "Please Login" })
    }
  })
});


// POST route to save post information from front end 

router.post('/', async (req, res) => {
  let token = req.headers.authorization;
  console.log(token)
  authService.verifyParticipant(token).then(async participant => {
    if (participant) {
      if (Object.keys(req.body).length === 0) {
        return res.send({
          message: "Invalid Submission",
          status: 400
        });
      }
      const post = new posts({
        //firstname: user.firstname,
        title: req.body.title,
        post: req.body.post,
        /*category: {
          type: String, 
          enum: ['mentalHealth', 'jobs', 'goodNews']
          //this specifies the set of allowed values. 
        }, */
      });
      console.log(post)
      try {
        const savedPost = await post.save();
        res.json({ error: null, data: savedPost, status: 200 });
        console.log(savedPost)
      } catch (error) {
        console.log(error)
        res.json({ error, status: 400 });
      }

    } else {
      return res.json({ message: "Please Login" })
    }
  })

});

module.exports = router;
