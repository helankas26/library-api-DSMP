const {getAccessToken, getRefreshToken} = require("./TokenGenerateUtil");
const {ACCESS_TOKEN_EXPIRES, REFRESH_TOKEN_EXPIRES, NODE_ENV} = require('../../config/serverConfig');

const sendResponseWithToken = async (res, statusCode, user) => {
    const accessToken = await getAccessToken(user.id);
    const refreshToken = await getRefreshToken(user.id);

    const accessTokenOptions = {
        maxAge: ACCESS_TOKEN_EXPIRES,
        httpOnly: true
    };

    const refreshTokenOptions = {
        maxAge: REFRESH_TOKEN_EXPIRES,
        httpOnly: true
    };

    if (NODE_ENV === 'production') {
        accessTokenOptions.secure = true;
        refreshTokenOptions.secure = true;
    }

    res.cookie('accessToken', accessToken, accessTokenOptions);
    res.cookie('refreshToken', refreshToken, refreshTokenOptions);

    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token: accessToken,
        user
    });
}

const sendResponse = async (res, statusCode, data) => {
    res.status(statusCode).json({
        status: 'success',
        ...data
    });
}

module.exports = {sendResponseWithToken, sendResponse};