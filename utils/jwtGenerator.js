const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

function jwtGenerator(user_id) {
    const payload = {
        user: user_id
    }

    return jwt.sign(payload, process.env.TOKEN_SECRET, {expiresIn: "1h"});
}

module.exports = jwtGenerator;