const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const Participant = require('../models/Participant');

// this is the middleware to validate your token 
var authService = {
    signParticipant: function (participant) {
        const token = jwt.sign({
            email: participant.email,
            id: participant._id
        },
            'secretkey',
            {
                expiresIn: '1h'
            }
        );
        return token;
    },
    verifyParticipant: function (token) {
        try {
            let decoded = jwt.verify(token, 'secretkey');
            return Participant.findById(decoded.id)
        } catch (err) {
            console.log(err)
            return new Promise((resolve, reject) => { resolve(null) });
        }
    },
    hashPassword: function (plainTextPassword) {
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(plainTextPassword, salt);
        return hash;
    },
    comparePasswords: function(plainTextPassword, hashedPassword) {
        return bcrypt.compareSync(plainTextPassword, hashedPassword)
    }
}

module.exports = authService
