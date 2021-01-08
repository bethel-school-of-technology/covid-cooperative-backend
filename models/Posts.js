//Require Mongoose
var mongoose = require('mongoose');
var Participant = require('./Participant')


// Define schema
var Schema = mongoose.Schema;

var posts = new Schema ({
  // firstname: {type: Schema.Types.ObjectId, ref: Participant},
  firstname: String,
  title: String,  
  post: String,
  /*category: {
    type: String, 
    enum: ['mentalHealth', 'jobs', 'goodNews']
    //this specifies the set of allowed values. 
  }, */
  deleted: {
    type: Boolean, 
    default: false
  },
}, {timestamps: true})
//timestamps creates createdAt & updatedAt models and will automatically update when model changes 

// Compile model from schema
var PostsModel = mongoose.model('Posts', posts);

module.exports = PostsModel;
