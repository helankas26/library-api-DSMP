const jwt = require("jsonwebtoken");

const {LOGIN_EXPIRES} = require('../../config/serverConfig');

const signToken = async (id) => {
    return await jwt.sign({id}, process.env.SECRET_KEY, {
        expiresIn: LOGIN_EXPIRES
    });
}

module.exports = {signToken};
