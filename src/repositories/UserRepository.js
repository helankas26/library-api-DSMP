const User = require('../models/UserSchema');
const passwordHash = require("../utils/PasswordHashUtil");
const UnauthorizedAccessError = require("../errors/UnauthorizedAccessError");
const {filterReqObj} = require("../utils/FilterRequestUtil");


const findAllUsers = async () => {
    try {
        return await User.find();
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
    findAllUsers, findUserById, updateUser, changeUserPassword, deleteUser
}