const crypto = require('crypto');
const util = require("util");
const jwt = require("jsonwebtoken");

const authRepository = require('../repositories/AuthRepository');
const passwordHash = require("../utils/PasswordHashUtil");
const UnauthorizedAccessError = require("../errors/UnauthorizedAccessError");
const {sendEmail} = require('../utils/EmailSenderUtil');
const PasswordDoesNotMatchError = require("../errors/PasswordDoesNotMatchError");
const userService = require("./UserService");


const refreshToken = async (req) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            throw new UnauthorizedAccessError('Refresh token does not exists!');
        }

        const decodedToken = await util.promisify(jwt.verify)(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);

        const user = await userService.findUserById(decodedToken);

        if (!user) {
            throw new UnauthorizedAccessError('The user with the given refresh token does not exist');
        }

        const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat);
        if (isPasswordChanged) {
            throw new UnauthorizedAccessError('The password has been changed recently. Please login again');
        }

        return user;
    } catch (error) {
        throw error;
    }
}

const createUser = async (reqBody) => {
    try {
        if (reqBody.password !== reqBody.confirmPassword) throw new PasswordDoesNotMatchError('Password does not match!');

        const user = await authRepository.createUser(reqBody);

        return user;
    } catch (error) {
        throw error;
    }
}

const loginUser = async (username, password) => {
    try {
        const user = await authRepository.loginUser(username);

        const isMatch = await passwordHash.verifyPassword(password, user.password);

        if (!isMatch) throw new UnauthorizedAccessError('Invalid credentials!');

        return user;
    } catch (error) {
        throw error;
    }
}

const forgetUserPassword = async (email) => {
    try {
        const user = await authRepository.forgetUserPassword(email);

        const resetToken = crypto.randomBytes(8).toString('hex');

        user.otp = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.otpExpires = Date.now() + 10 * 60 * 1000;

        await user.save({validateBeforeSave: false});

        const message = `We have received a password reset request. Please use the below OTP to reset your password\n\n\t\t\tOTP is: ${resetToken}\n\nThis reset password OTP will be valid only for 10 minutes.`;

        try {
            await sendEmail({
                email: user.profile.email,
                subject: 'Password change request received',
                message: message
            });

            return true;
        } catch {
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save({validateBeforeSave: false});

            throw new Error('There was an error sending password reset email. Please try again later');
        }
    } catch (error) {
        throw error;
    }
}

const resetUserPassword = async (reqBody) => {
    try {
        if (reqBody.password !== reqBody.confirmPassword) throw new PasswordDoesNotMatchError('Password does not match!');

        reqBody.otp = crypto.createHash('sha256').update(reqBody.otp).digest('hex');

        const user = await authRepository.resetUserPassword(reqBody);

        return user;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    refreshToken, createUser, loginUser, forgetUserPassword, resetUserPassword
}