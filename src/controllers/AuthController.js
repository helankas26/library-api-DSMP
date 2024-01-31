const authService = require('../services/AuthService');
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const CredentialsNotFoundError = require("../errors/CredentialsNotFoundError");
const {sendResponseWithToken, sendResponse} = require("../utils/SendResponseUtil");


const refresh = asyncErrorHandler(async (req, resp, next) => {
    const user = await authService.refreshToken(req);
    await sendResponseWithToken(resp, 201, user);
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
    if (!cookies?.refreshToken || !cookies?.accessToken) return await sendResponse(resp, 204);
    resp.clearCookie('refreshToken');
    resp.clearCookie('accessToken');
    await sendResponse(resp, 200);
});

const forgetPassword = asyncErrorHandler(async (req, resp, next) => {
    const {email} = req.body;

    const isEmailSend = await authService.forgetUserPassword(email);
    await sendResponse(resp, 200, {send: isEmailSend});
});

const resetPassword = asyncErrorHandler(async (req, resp, next) => {
    const user = await authService.resetUserPassword(req.body);
    await sendResponseWithToken(resp, 201, user);
});

module.exports = {
    refresh, signup, login, logout, forgetPassword, resetPassword
}