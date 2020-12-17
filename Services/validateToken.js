const jwt = require('jsonwebtoken');

// this is the middleware to validate your token 
const verifyToken = (req, res, next) => {
    const token = req.header('auth-token');
    // the header containes the information about the token(the algorithm used to hash the token)
    if (!token)
        return res.status(401).json({ error: "Unidentified User" });

    try {
        const verified = jwt.verify(token, process.env.JWT_KEY); 
        req.participant = verified; 
    } catch (err) {
        res.status(400).json({ error: "Invalid Token" })
    }
}; 

module.exports = verifyToken