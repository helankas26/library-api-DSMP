const jwt = require("jsonwebtoken");

const signToken = async (id) => {
    return jwt.sign({id}, process.env.SECRET_KEY, {
        expiresIn: process.env.LOGIN_EXPIRES
    });
}

module.exports = {signToken};
