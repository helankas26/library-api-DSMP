const User = require('../models/UserSchema');
const passwordHash = require("../utils/PasswordHashUtil");
const UserAlreadyExistsError = require("../errors/UserAlreadyExistsError");
const UnauthorizedAccessError = require("../errors/UnauthorizedAccessError");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");


const findUserByIdAndRefreshToken = async (decodedToken, refreshToken) => {
    try {
        return await User.findByIdAndRefreshToken(decodedToken.id, refreshToken);
    } catch (error) {
        throw error;
    }
}

const createUser = async (userData) => {
    try {
        const existingUser = await User.findByUsernameOrProfile(userData.username, userData.profile);

        if (existingUser) {
            if (existingUser.username === userData.username) throw new UserAlreadyExistsError('User with this username already exists');
            if (existingUser.profile === userData.profile) throw new UserAlreadyExistsError('User with this profile already exists');
        }

        const user = new User({
            username: userData.username,
            profile: userData.profile,
            password: await passwordHash.hashPassword(userData.password)
        });

        return await user.save();
    } catch (error) {
        throw error;
    }
}

const findUserByProfile = async (regNo) => {
    try {
        return await User.findByProfile(regNo);
    } catch (error) {
        throw error;
    }
}

const loginUser = async (username) => {
    try {
        const user = await User.findByUsername(username);

        if (!user) throw new UnauthorizedAccessError('User not found!');

        return user;
    } catch (error) {
        throw error;
    }
}

const logoutUser = async (refreshToken) => {
    try {
        return await User.findOne({refreshToken: refreshToken});
    } catch (error) {
        throw error;
    }
}

const forgetUserPassword = async (email) => {
    try {
        const user = await User.findByEmail(email);

        if (!user) throw new NotFoundError(`Could not find the user with given email: ${email}`);

        return user;
    } catch (error) {
        throw error;
    }
}

const findUserByOtp = async (otp) => {
    try {
        return await User.findByOtp(otp);
    } catch (error) {
        throw error;
    }
}

const resetUserPassword = async (userData) => {
    try {
        const user = await User.findByOtpWithExpires(userData.otp);

        if (!user) {
            throw new BadRequestError('OTP is invalid or has expired');
        }

        user.password = await passwordHash.hashPassword(userData.password);
        user.otp = undefined;
        user.otpExpires = undefined;
        user.passwordChangedAt = Date.now();

        await user.save();

        return user;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findUserByIdAndRefreshToken,
    createUser,
    findUserByProfile,
    loginUser,
    logoutUser,
    forgetUserPassword,
    findUserByOtp,
    resetUserPassword,
}