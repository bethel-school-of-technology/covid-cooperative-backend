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
  }
});

// Compile model from schema
var ParticipantModel = mongoose.model('Participant', Participant);

module.exports = ParticipantModel;