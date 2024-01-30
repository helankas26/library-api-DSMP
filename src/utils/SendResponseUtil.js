const {signToken} = require("./SignTokenGenerateUtil");
const sendResponseWithToken = async (res, statusCode, user) => {
    const token = await signToken(user._id);

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