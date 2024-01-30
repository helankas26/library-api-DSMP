const {signToken} = require("./SignTokenGenerateUtil");
const {LOGIN_EXPIRES, NODE_ENV} = require('../../config/serverConfig');

const sendResponseWithToken = async (res, statusCode, user) => {
    const token = await signToken(user._id);

    const options = {
        maxAge: LOGIN_EXPIRES,
        httpOnly: true
    };

    if (NODE_ENV === 'production')
        options.secure = true

    res.cookie('jwt', token, options);

    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token: token,
        data: {
            user
        }
    });
}

const sendResponse = async (res, statusCode, data) => {
    res.status(statusCode).json({
        status: 'success',
        data
    });
}

module.exports = {sendResponseWithToken, sendResponse};