var express = require('express');
var router = express.Router();
var Participant = require('../models/Participant');
const { signupValidation, loginValidation } = require('../Services/validation');
var authService = require('../Services/authService')


//GET ROUTE PARTICIPANTS PAGE - this is the "READ" of CRUD

router.get('/', async function(req,res) {
  try {
    const participants = await Participant.find();

    res.status(200).json({
      data: { participants }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
});

//THIS IS FIND SINGLE PARTICIPANT ROUTE

router.get('/:id', async function(req,res) {
  try {
    let id = req.params.id;
    const participant = await Participant.findById(id);

    res.status(200).json({
      data: { participant }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
});

//THIS IS THE "CREATE" OF CRUD

router.post('/add', async function(req,res){
  try {
    const newParticipant = await Participant.create(req.body);

    res.status(201).json({
      data: { participant: newParticipant }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
});

//THIS IS THE "UPDATE OF CRUD"

router.put('/update/:id', async function(req,res){
  try {
    const participant = await Participant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      data: { participant }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
});

//THIS IS THE "DELETE" OF CRUD

router.delete('/delete/:id', async function(req,res){
  try {
    await Participant.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
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

module.exports = router;

//Resource: https://codeburst.io/to-handle-authentication-with-node-js-express-mongo-jwt-7e55f5818181