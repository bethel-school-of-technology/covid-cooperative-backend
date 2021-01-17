var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors'); //protects unauthorized people from making requests
var bodyParser = require('body-parser'); 


const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://teamgo1:readysetgo@cluster0.zmecc.mongodb.net/Covid-Cooperative?retryWrites=true&w=majority', {useNewUrlParser: true});

var indexRouter = require('./routes/index');
var postsRouter = require('./routes/posts');
var participantsRouter = require('./routes/participants'); //importing routes in participant.js

//readysetgo

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(cors(
  {
    origin: ["http://localhost:3000"],
    credentials: true
  }
)); 

app.use(bodyParser.json()); 

app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/participants', participantsRouter); //importing routes in participant.js


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("We're in!");
});


module.exports = app;
