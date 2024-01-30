const User = require('../models/UserSchema');
const passwordHash = require("../utils/PasswordHashUtil");
const UserAlreadyExistsError = require("../errors/UserAlreadyExistsError");
const UnauthorizedAccessError = require("../errors/UnauthorizedAccessError");
const NotFoundError = require("../errors/NotFoundError");
const {filterReqObj} = require("../utils/FilterRequestUtil");

const findAllUsers = async () => {
    try {
        return await User.find();
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

const findUserById = async (params) => {
    try {
        return await User.findById(params.id);
    } catch (error) {
        throw error;
    }
}

const updateUser = async (req) => {
    try {
        const filterObj = filterReqObj(req.body, 'username');

        return await User.findByIdAndUpdate(req.user.id, filterObj, {new: true, runValidators: true});
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

const changeUserPassword = async (req) => {
    try {
        const userData = req.body;

        const user = await User.findById(req.user._id).select('+password');

        const isMatch = await passwordHash.verifyPassword(userData.currentPassword, user.password);

        if (!isMatch) throw new UnauthorizedAccessError('The current password you provided is wrong!');

        user.password = await passwordHash.hashPassword(userData.password);
        user.passwordChangedAt = Date.now();

        await user.save();

        return user;
    } catch (error) {
        throw error;
    }
}

const deleteUser = async (params) => {
    try {
        return await User.findByIdAndDelete(params.id);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findAllUsers,
    createUser,
    loginUser,
    forgetUserPassword,
    findUserById,
    updateUser,
    resetUserPassword,
    changeUserPassword,
    deleteUser
}