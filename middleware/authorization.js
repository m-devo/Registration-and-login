const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

//this middleware will on continue on if the token is inside the local storage

module.exports = function(req, res, next) {
  // Get token from header
    const TOKEN = req.header("TOKEN");

  // Check if not token
    if (!TOKEN) {
    return res.status(403).json({ message: "authorization denied" });
    }

  // Verify token
    try {
    //it is going to give use the user id (user:{id: user.id})
    const verify = jwt.verify(TOKEN, process.env.TOKEN_SECRET);

    req.user = verify.user;
    next();
    } catch (error) {
    console.error(error.message);
    res.status(401).json({ message: "Token is not valid" });
    }
};