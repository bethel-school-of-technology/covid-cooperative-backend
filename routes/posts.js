var express = require('express');
var router = express.Router();
var Participant = require('../models/Participant');
var Posts = require('../models/Posts')
var authService = require('../Services/authService')

// POST route to save post information from front end 

router.post('/', function (req, res, next) {
  
})

module.exports = router;
