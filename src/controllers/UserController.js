const userService = require('../services/UserService');
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const {sendResponse} = require("../utils/SendResponseUtil");
const BadRequestError = require("../errors/BadRequestError");


const findAllUsers = asyncErrorHandler(async (req, resp, next) => {
    const users = await userService.findAllUsers();
    await sendResponse(resp, 200, {users: users, count: users.length});
});

const findUserById = asyncErrorHandler(async (req, resp, next) => {
    const user = await userService.findUserById(req.params);
    await sendResponse(resp, 200, {user});
});

const updateUser = asyncErrorHandler(async (req, resp, next) => {
    if (req.body.password || req.body.confirmPassword) {
        const error = new BadRequestError('You cannot update password');
        return next(error);
    }

    const user = await userService.updateUser(req);
    await sendResponse(resp, 200, {user});
});

const changePassword = asyncErrorHandler(async (req, resp, next) => {
    const userWithToken = await userService.changeUserPassword(req, resp);
    await sendResponse(resp, 201, userWithToken);
});

const deleteUser = asyncErrorHandler(async (req, resp, next) => {
    const user = await userService.deleteUser(req.params);
    await sendResponse(resp, 200, {id: user._id});
});

module.exports = {
    findAllUsers, findUserById, updateUser, changePassword, deleteUser
}