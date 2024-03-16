const authService = require('../services/AuthService');
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const CredentialsNotFoundError = require("../errors/CredentialsNotFoundError");
const {sendResponse} = require("../utils/SendResponseUtil");


const refreshToken = asyncErrorHandler(async (req, resp, next) => {
    const userWithToken = await authService.refreshToken(req);
    await sendResponse(resp, 201, userWithToken);
});

const checkRegistrationValid = asyncErrorHandler(async (req, resp, next) => {
    const {regNo} = req.body;

    const isValid = await authService.checkRegistrationValid(regNo);
    await sendResponse(resp, 200, {valid: isValid});
});

const signup = asyncErrorHandler(async (req, resp, next) => {
    const userWithToken = await authService.createUser(req.body, resp);
    await sendResponse(resp, 201, userWithToken);
});

const login = asyncErrorHandler(async (req, resp, next) => {
    const {username, password} = req.body;

    if (!username || !password) throw new CredentialsNotFoundError('Please provide username & password!');

    const userWithToken = await authService.loginUser(username, password, resp);
    await sendResponse(resp, 201, userWithToken);
});

const logout = asyncErrorHandler(async (req, resp, next) => {
    const cookies = req.cookies
    if (!cookies?.refreshToken) return await sendResponse(resp, 204);

    await authService.logoutUser(cookies.refreshToken, resp);
    await sendResponse(resp, 204);
});

const forgetPassword = asyncErrorHandler(async (req, resp, next) => {
    const {email} = req.body;

    const isEmailSend = await authService.forgetUserPassword(email);
    await sendResponse(resp, 200, {send: isEmailSend});
});

const checkOtpValid = asyncErrorHandler(async (req, resp, next) => {
    const {otp} = req.body;

    const isValid = await authService.checkOtpValid(otp);
    await sendResponse(resp, 200, {valid: isValid});
});


const resetPassword = asyncErrorHandler(async (req, resp, next) => {
    const userWithToken = await authService.resetUserPassword(req.body, resp);
    await sendResponse(resp, 201, userWithToken);
});

module.exports = {
    refreshToken, checkRegistrationValid, signup, login, logout, forgetPassword, checkOtpValid, resetPassword
}