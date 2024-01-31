const User = require('../models/UserSchema');
const passwordHash = require("../utils/PasswordHashUtil");
const UserAlreadyExistsError = require("../errors/UserAlreadyExistsError");
const UnauthorizedAccessError = require("../errors/UnauthorizedAccessError");
const NotFoundError = require("../errors/NotFoundError");


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
            password: await passwordHash.hashPassword(userData.password),
            role: userData.role
        });

        return await user.save();
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

const forgetUserPassword = async (email) => {
    try {
        const user = await User.findByEmail(email);

        if (!user) throw new NotFoundError(`Could not find the user with given email: ${email}`);

        return user;
    } catch (error) {
        throw error;
    }
}

const resetUserPassword = async (userData) => {
    try {
        const user = await User.findByOtp(userData.otp);

        if (!user) {
            const error = new Error('Token is invalid or has expired');
            error.statusCode = 400;
            throw error;
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
    createUser, loginUser, forgetUserPassword, resetUserPassword,

}