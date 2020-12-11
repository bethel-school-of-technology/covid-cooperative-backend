var express = require('express');
var router = express.Router();
var particpant = require('../models/participant')

/* GET home page. */
router.get('/', async function(req, res, next) {
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

module.exports = router;