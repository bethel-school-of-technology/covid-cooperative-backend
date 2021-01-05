var express = require('express');
var router = express.Router();
var Participant = require('../models/Participant');
var Posts = require('../models/Participant')
var authService = require('../Services/authService')

// POST route to save post information from front end 

router.post('/', function (req, res, next) {
  let token = req.cookies.token;
  authService.verifyParticipant(token).then(participant => {
      if (participant) {
        
      } else {
          return res.json({ message: "Please Login" })
      }
  })
})

module.exports = router;
