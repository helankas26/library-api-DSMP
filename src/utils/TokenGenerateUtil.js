const jwt = require("jsonwebtoken");

const {ACCESS_TOKEN_EXPIRES, REFRESH_TOKEN_EXPIRES, NODE_ENV} = require('../config/serverConfig');

const getAccessToken = async (user) => {
    return jwt.sign({id: user.id, role: user.role}, process.env.ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: ACCESS_TOKEN_EXPIRES
    });
}

const getRefreshToken = async (res, user) => {
    const refreshToken = jwt.sign({id: user.id}, process.env.REFRESH_TOKEN_SECRET_KEY, {
        expiresIn: REFRESH_TOKEN_EXPIRES
    });

    const refreshTokenOptions = {
        maxAge: REFRESH_TOKEN_EXPIRES,
        httpOnly: true
    };

    if (NODE_ENV === 'production') {
        refreshTokenOptions.secure = true;
    }

    res.cookie('refreshToken', refreshToken, refreshTokenOptions);

    return refreshToken;
}

module.exports = {getAccessToken, getRefreshToken};
