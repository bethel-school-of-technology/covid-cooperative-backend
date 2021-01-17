var express = require('express');
var router = express.Router();
var Participant = require('../models/Participant'); //brining in participants schema
const { signupValidation, loginValidation } = require('../Services/validation');
var authService = require('../Services/authService')

// For every model you create you should create a routes file. 
// This file holds all of our routes for the participants. 


//GET ROUTE PARTICIPANTS PAGE - this is the "READ" of CRUD
// the two arguments passed into the callback are req and respond.
//the req is what is received from a call and the res is the response.
// we request the particiapnt data and it is read.


router.get('/', async function(req,res) {
  try {
    const participants = await Participant.find();

    res.status(200).json({
      data: { participants } // this is reading whatever participants data is in the schema
    });
  } catch (err) {
    res.status(404).json({ //shows any errors
      status: 'fail',
      message: err
    });
  }
});

// Now we have our "READ" and we need to be able to "CREATE" participants 

//THIS IS THE "CREATE" OF CRUD. It will be a post route instead of a get route.
// the /add is adding one participant (newParticipant)
// the body of the request is where the data comes in. we need to parse the body so it can be shown as json data.  
// those things are added into app.js

router.post('/add', async function(req,res){
  try {
    const newParticipant = await Participant.create(req.body);

    res.status(201).json({
      data: { participant: newParticipant }
    });
  } catch (err) {
    console.log(err)
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
});

// Next we want to be able to find a single participant so we create a 
// get route with an id parameter inside the code. 
// We use the function findById and pass in the id variable. 
// Instead of getting all of the participants (plural) in the first get route
// we are just getting one single participant 
// so to display in browser it would be participants/762 for example.

router.get('/:id', async function(req,res) {
  try {
    let id = req.params.id;
    const participant = await Participant.findById(id);

    res.status(200).json({
      data: { participant } // we are just getting one single participant 
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
});

//THIS IS THE "UPDATE OF CRUD"
//This has to be a put route.

router.put('/update/:id', async function(req,res){
  try {
    const participant = await Participant.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //this puts the new data in 
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
// now we have a route if we want to delete a participant 
// it will be a delete route

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

//--------------END OF JENNIFER CODE-------------------//

// SIGN IN ROUTE 

router.post("/signup", async (req, res) => {
  console.log(req.body)
  // validate the user 
  const { error } = signupValidation(req.body);
  if (error) {
    //return res.status(400).json({ error: error.details[0].message });
    return res.json({ error: error.details[0].message });
  }
  // check if email is already registered, if yes send an error 
  const doesEmailExist = await Participant.findOne({ "client.email": req.body.email });
  console.log("--------")
  console.log(doesEmailExist)
  if (doesEmailExist) {
    
    return res.json({ error: 'Email already exists' , status: 400 });
  }
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
    res.json({ error: null, data: savedParticipant, status: 200 });
  } catch (error) {
    res.json({ error, status:400 });
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
// Jennifer resource:
// https://medium.com/@SigniorGratiano/mongoose-and-express-68994fcfdeff
