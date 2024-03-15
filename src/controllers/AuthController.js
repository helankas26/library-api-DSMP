const authService = require('../services/AuthService');
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const CredentialsNotFoundError = require("../errors/CredentialsNotFoundError");
const {sendResponseWithToken, sendResponse} = require("../utils/SendResponseUtil");


const refreshToken = asyncErrorHandler(async (req, resp, next) => {
    const user = await authService.refreshToken(req);
    await sendResponseWithToken(resp, 201, user);
});

const checkRegistrationValid = asyncErrorHandler(async (req, resp, next) => {
    const {regNo} = req.body;

    const isValid = await authService.checkRegistrationValid(regNo);
    await sendResponse(resp, 200, {valid: isValid});
});

const signup = asyncErrorHandler(async (req, resp, next) => {
    const user = await authService.createUser(req.body);
    await sendResponseWithToken(resp, 201, user);
});

const login = asyncErrorHandler(async (req, resp, next) => {
    const {username, password} = req.body;

    if (!username || !password) throw new CredentialsNotFoundError('Please provide username & password!');

    const user = await authService.loginUser(username, password);
    await sendResponseWithToken(resp, 201, user);
});

const logout = asyncErrorHandler(async (req, resp, next) => {
    const cookies = req.cookies
    if (!cookies?.refreshToken) return await sendResponse(resp, 204);

    resp.clearCookie('refreshToken', {httpOnly: true, secure: true});
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
    const user = await authService.resetUserPassword(req.body);
    await sendResponseWithToken(resp, 201, user);
});

module.exports = {
    refreshToken, checkRegistrationValid, signup, login, logout, forgetPassword, checkOtpValid, resetPassword
}