var express = require('express');
var router = express.Router();
var Participant = require('../models/Participant');
const { signupValidation, loginValidation } = require('../Services/validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



// SIGN IN ROUTES 
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

  //hash the password
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

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
    password, //hashed password 
  });
  try {
    const savedParticipant = await participant.save();
    res.json({ error: null, data: savedParticipant });
  } catch (error) {
    res.status(400).json({ error });
  }
});


//LOGIN ROUTES 

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
  if (!participant)
    return res.status(400).json({ error: "Email is wrong" });
  //check if password is correct 
  const goodPassword = await bcrypt.compare(req.body.password, participant.password)
  if (!goodPassword)
    return res.send(400).json({ error: "Incorrect Password" });

  const token = jwt.sign(
    //payload data 
    {
      email: participant.email,
      id: participant.id
    }, "OneTwoThree" //this is the secret key
  );
  res.header("auth-token", token).json({
    error: null,
    data: {
      token,
    },
  })
});


//LOGOUT ROUTE

module.exports = router;

//Resource: https://codeburst.io/to-handle-authentication-with-node-js-express-mongo-jwt-7e55f5818181