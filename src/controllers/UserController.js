const userService = require('../services/UserService');
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const {sendResponse} = require("../utils/SendResponseUtil");
const BadRequestError = require("../errors/BadRequestError");


const findAllUsers = asyncErrorHandler(async (req, resp, next) => {
    const users = await userService.findAllUsers();
    await sendResponse(resp, 200, {users: users, count: users.length});
});

const findAllUsersWithPagination = asyncErrorHandler(async (req, resp, next) => {
    const usersWithPagination = await userService.findAllUsersWithPagination(req);
    await sendResponse(resp, 200, usersWithPagination);
});

const findAllUsersBySearchWithPagination = asyncErrorHandler(async (req, resp, next) => {
    const usersWithPagination = await userService.findAllUsersBySearchWithPagination(req);
    await sendResponse(resp, 200, usersWithPagination);
});

const findUserById = asyncErrorHandler(async (req, resp, next) => {
    const user = await userService.findUserById(req.params);
    await sendResponse(resp, 200, {user});
});

const updateUser = asyncErrorHandler(async (req, resp, next) => {
    if (req.params.id === req.user.id) {
        const error = new BadRequestError('For current user can not change role.');
        return next(error);
    }

    const user = await userService.updateUser(req);
    await sendResponse(resp, 201, {user});
});

const updateUserByAuthUser = asyncErrorHandler(async (req, resp, next) => {
    if (req.body.password || req.body.confirmPassword) {
        const error = new BadRequestError('You cannot update password');
        return next(error);
    }

    const user = await userService.updateUserByAuthUser(req);
    await sendResponse(resp, 201, {user});
});

const changePasswordByAuthUser = asyncErrorHandler(async (req, resp, next) => {
    if (!req.body.password || !req.body.confirmPassword) {
        const error = new BadRequestError('Please provide password & confirmPassword!');
        return next(error);
    }

    const userWithToken = await userService.changeUserPasswordByAuthUser(req, resp);
    await sendResponse(resp, 201, userWithToken);
});

const deleteUser = asyncErrorHandler(async (req, resp, next) => {
    if (req.params.id === req.user.id) {
        const error = new BadRequestError('Current user can not delete the user account.');
        return next(error);
    }

    const user = await userService.deleteUser(req.params);
    await sendResponse(resp, 204, {id: user._id});
});

module.exports = {
    findAllUsers,
    findAllUsersWithPagination,
    findAllUsersBySearchWithPagination,
    findUserById,
    updateUser,
    updateUserByAuthUser,
    changePasswordByAuthUser,
    deleteUser
}