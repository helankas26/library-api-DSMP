const jwt = require("jsonwebtoken");

const {ACCESS_TOKEN_EXPIRES, REFRESH_TOKEN_EXPIRES} = require('../../config/serverConfig');

const getAccessToken = async (id) => {
    return jwt.sign({id}, process.env.ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: ACCESS_TOKEN_EXPIRES
    });
}

const getRefreshToken = async (id) => {
    return jwt.sign({id}, process.env.REFRESH_TOKEN_SECRET_KEY, {
        expiresIn: REFRESH_TOKEN_EXPIRES
    });
}

module.exports = {getAccessToken, getRefreshToken};