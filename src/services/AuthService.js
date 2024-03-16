const crypto = require('crypto');
const util = require("util");
const jwt = require("jsonwebtoken");

const authRepository = require('../repositories/AuthRepository');
const passwordHash = require("../utils/PasswordHashUtil");
const UnauthorizedAccessError = require("../errors/UnauthorizedAccessError");
const {sendEmail} = require('../utils/EmailSenderUtil');
const PasswordDoesNotMatchError = require("../errors/PasswordDoesNotMatchError");
const profileService = require("./ProfileService");
const UserAlreadyExistsError = require("../errors/UserAlreadyExistsError");
const BadRequestError = require("../errors/BadRequestError");
const tokenGenerate = require("../utils/TokenGenerateUtil");


const refreshToken = async (req) => {
    try {
        let refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            throw new UnauthorizedAccessError('Refresh token does not exists!');
        }

        const decodedToken = await util.promisify(jwt.verify)(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);

        refreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const user = await authRepository.findUserByIdAndRefreshToken(decodedToken, refreshToken);

        if (!user) {
            throw new UnauthorizedAccessError('The user with the given refresh token does not exist');
        }

        const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat);
        if (isPasswordChanged) {
            throw new UnauthorizedAccessError('The password has been changed recently. Please login again');
        }

        const accessToken = await tokenGenerate.getAccessToken(user);

        return {user, accessToken};
    } catch (error) {
        throw error;
    }
}

const checkRegistrationValid = async (regNo) => {
    try {
        const user = await authRepository.findUserByProfile(regNo);

        if (user) throw new UserAlreadyExistsError('User with this Registration No. already exists');

        const profile = await profileService.findProfileById({id: regNo});

        return profile !== null;
    } catch (error) {
        throw error;
    }
}

const createUser = async (reqBody, res) => {
    try {
        if (reqBody.password !== reqBody.confirmPassword) throw new PasswordDoesNotMatchError('Password does not match!');

        let user = await authRepository.createUser(reqBody);

        const accessToken = await tokenGenerate.getAccessToken(user);
        const refreshToken = await tokenGenerate.getRefreshToken(res, user);

        user.refreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
        user = await user.save();

        user.password = undefined;
        user.refreshToken = undefined;

        return {user, accessToken};
    } catch (error) {
        throw error;
    }
}

const loginUser = async (username, password, res) => {
    try {
        let user = await authRepository.loginUser(username);

        const isMatch = await passwordHash.verifyPassword(password, user.password);

        if (!isMatch) throw new UnauthorizedAccessError('Invalid credentials!');

        const accessToken = await tokenGenerate.getAccessToken(user);
        const refreshToken = await tokenGenerate.getRefreshToken(res, user);

        user.refreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
        user = await user.save();

        user.password = undefined;
        user.refreshToken = undefined;

        return {user, accessToken};
    } catch (error) {
        throw error;
    }
}

const logoutUser = async (refreshToken, res) => {
    try {
        refreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const user = await authRepository.logoutUser(refreshToken);

        if (!user) {
            res.clearCookie('refreshToken', {httpOnly: true, secure: true});
            return;
        }

        user.refreshToken = undefined;
        await user.save();

        res.clearCookie('refreshToken', {httpOnly: true, secure: true});
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

const checkOtpValid = async (otp) => {
    try {
        otp = crypto.createHash('sha256').update(otp).digest('hex');

        const user = await authRepository.findUserByOtp(otp);

        if (user && user.otpExpires < Date.now()) {
            throw new BadRequestError('OTP has expired');
        }

        return user !== null;
    } catch (error) {
        throw error;
    }
}

const resetUserPassword = async (reqBody, res) => {
    try {
        if (reqBody.password !== reqBody.confirmPassword) throw new PasswordDoesNotMatchError('Password does not match!');

        reqBody.otp = crypto.createHash('sha256').update(reqBody.otp).digest('hex');

        let user = await authRepository.resetUserPassword(reqBody);

        const accessToken = await tokenGenerate.getAccessToken(user);
        const refreshToken = await tokenGenerate.getRefreshToken(res, user);

        user.refreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
        user = await user.save();

        user.password = undefined;
        user.refreshToken = undefined;

        return {user, accessToken};
    } catch (error) {
        throw error;
    }
}

module.exports = {
    refreshToken,
    checkRegistrationValid,
    createUser,
    loginUser,
    logoutUser,
    forgetUserPassword,
    checkOtpValid,
    resetUserPassword
}