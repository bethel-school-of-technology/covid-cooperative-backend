//Require Mongoose
var mongoose = require('mongoose');


// Define schema
var Schema = mongoose.Schema;

var Participant = new Schema({
  client: {
      firstname: String,
      lastname: String,
      email: String
  },
  location: {
    city: String,
    state: String,
  }, 
  password: {
    required: true,
    type: String
  },
  admin: {
    type: Boolean, 
    default: false 
  },
  deleted: {
    type: Boolean, 
    default: false, 
  },
  
}, {timestamps: true});

//timestamps creates createdAt & updatedAt models and will automatically update when model changes 

// Compile model from schema
var ParticipantModel = mongoose.model('Participant', Participant);

module.exports = ParticipantModel; 
