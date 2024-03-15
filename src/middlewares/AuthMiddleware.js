const jwt = require('jsonwebtoken');
const util = require('util');

const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const UnauthorizedAccessError = require("../errors/UnauthorizedAccessError");
const PermissionDeniedError = require("../errors/PermissionDeniedError");
const userService = require("../services/UserService");


const verifyToken = asyncErrorHandler(async (req, res, next) => {

    // 1. Read the token & check if it exists
    // Get accessToken via authorization headers
    const authHeader = req.headers.authorization || req.headers.Authorization;
    let accessToken;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        accessToken = authHeader.split(' ')[1];
    }

    if (!accessToken) {
        throw new UnauthorizedAccessError('Access token does not exists!');
    }

    // Get accessToken via cookies
    /*const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        throw new UnauthorizedAccessError('Access token does not exists!');
    }*/

    // 2. Validate the token
    const decodedToken = await util.promisify(jwt.verify)(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY);

    // 3. If the user exists
    const user = await userService.findUserById(decodedToken);

    if (!user) {
        throw new UnauthorizedAccessError('The user with the given access token does not exist');
    }

    // 4. If the user change password after the token was issued
    const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat);
    if (isPasswordChanged) {
        const error = new UnauthorizedAccessError('The password has been changed recently. Please login again');
        return next(error)
    }

    // 5. Allow user to access route
    req.user = user;
    next();
});

const checkPermission = (...role) => {
    return (req, res, next) => {
        if (!role.includes(req.user.role)) {
            const error = new PermissionDeniedError('You do not have permission to perform this action');
            next(error)
        }

        next();
    }
}

module.exports = {verifyToken, checkPermission};