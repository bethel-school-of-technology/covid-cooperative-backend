var express = require('express');
var router = express.Router();
var Participant = require('../models/Participant');
const { signupValidation, loginValidation } = require('../Services/validation');
var authService = require('../Services/authService')

//TOKEN ROUTE 

router.post('/token', function (req, res, next) {
  let token = req.cookies.token;

  if (!token) {
    res.json({ Participant: null, token: null });
    return;
  }
  authService.verifyParticipant(token).then(participant => {

    if (!participant) {
      res.json({ Participant: null, token: null });
    }

    let token = authService.signParticipant(participant);
    res.cookie('token', token, { httpOnly: true });
    res.json({ participant, token })
  });
});

// SIGN IN ROUTE 

router.post("/signup", async (req, res) => {
  // validate the user 
  const { error } = signupValidation(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  // check if email is already registered, if yes send an error 
  const doesEmailExist = await Participant.findOne({ email: req.body.email });
  if (doesEmailExist)
    return res.status(400).json({ error: 'Email already exists' });

  const participant = new Participant({
    client: {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email
    },
    location: {
      city: req.body.city,
      state: req.body.state,
    },
    password: authService.hashPassword(req.body.password)
  })
  try {
    const savedParticipant = await participant.save();
    res.json({ error: null, data: savedParticipant });
  } catch (error) {
    res.status(400).json({ error });
  }
});


  //LOGIN ROUTE

  router.post('/login', async (req, res) => {
    // validate the user  
    const { error } = loginValidation(req.body);
    //throw validation errors 
    if (error)
      return res.status(400).json({ error: error.details[0].message });
    console.log(req.body)
    //find user by email
    const participant = await Participant.findOne({ "client.email": req.body.email });
    console.log(participant)
    //throw error if email is wrong 
    if (!participant) {
      return res.status(400).json({ error: "Email is wrong" });
    } else {
      let passwordMatch = authService.comparePasswords(req.body.password, participant.password);
      if (passwordMatch) {
        let token = authService.signParticipant(participant);
        res.cookie('token', token, { httpOnly: true });
        res.json({ participant, token })
        console.log(participant) 
      } else {
        res.json({ message: "Email and Passwords do not match" }); 
      }
    }
  });



//LOGOUT ROUTE

module.exports = router;

//Resource: https://codeburst.io/to-handle-authentication-with-node-js-express-mongo-jwt-7e55f5818181