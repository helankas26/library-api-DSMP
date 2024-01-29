const jwt = require('jsonwebtoken');
const util = require('util');

const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const UnauthorizedAccessError = require("../errors/UnauthorizedAccessError");
const PermissionDeniedError = require("../errors/PermissionDeniedError");
const userService = require("../services/UserService");

const verifyToken = asyncErrorHandler(async (req, res, next) => {
    // 1. Read the token & check if it exists
    const testToken = req.headers.authorization;
    let token;
    if (testToken && testToken.startsWith('Bearer')) {
        token = testToken.split(' ')[1];
    }

    if (!token) {
        const error = new UnauthorizedAccessError('Token does not exists!');
        next(error)
    }

    // 2. Validate the token
    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_KEY);

    // 3. If the user exists
    const user = await userService.findUserById(decodedToken);

    if (!user) {
        const error = new UnauthorizedAccessError('The user with the given token does not exist');
        next(error)
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