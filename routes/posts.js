const { request } = require('express');
var express = require('express');
var router = express.Router();
var Participant = require('../models/Participant');
var posts = require('../models/Posts')
var authService = require('../Services/authService')

// POST route to save post information from front end 

router.post('/', async (req, res ) => {
   if (Object.keys(req.body).length === 0){
     return res.status(400).send({
       message: "Invalid Submission"
     });
   }
   const post = new posts ({
        firstname: req.body.firstname, // when adding jwt token change to user.firstname
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
      res.json({ error: null, data: savedPost });
      console.log(savedPost)
    } catch (error) {
      console.log(error)
      res.status(400).json({ error });
    }
  });

    module.exports = router;
