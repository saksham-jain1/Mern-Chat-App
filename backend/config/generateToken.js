const jwt = require('jsonwebtoken')

const generateToken = (_id) => {
    return jwt.sign({_id}, process.env.JWT_SECRET, {expiresIn: '31d'});
};


module.exports = generateToken;