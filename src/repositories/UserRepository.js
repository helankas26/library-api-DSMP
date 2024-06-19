const User = require('../models/UserSchema');
const Profile = require('../models/ProfileSchema');
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

const findAllUsersWithPagination = async (page, size) => {
    try {
        const totalCount = await User.countDocuments();
        const totalPages = Math.ceil(totalCount / size);
        const skip = (page - 1) * size;
        const from = skip + 1;

        const users = await User.find({}).skip(skip).limit(size).populate({
            path: 'profile',
            select: ['fullName', 'avatar']
        });
        const to = skip + users.length;

        return {users, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }
}

const findAllUsersBySearchWithPagination = async (searchText, page, size) => {
    try {
        const profiles = await Profile.find({$text: {$search: searchText}}).select('_id');
        const searchedProfileIds = profiles.map(profile => profile._id);

        const totalCount = await User.find({
            $or: [
                {$text: {$search: searchText}},
                {profile: {$in: searchedProfileIds}}
            ]
        }).countDocuments();
        const totalPages = Math.ceil(totalCount / size);
        const skip = (page - 1) * size;
        const from = skip + 1;

        const users = await User.find({
            $or: [
                {$text: {$search: searchText}},
                {profile: {$in: searchedProfileIds}}
            ]
        }).skip(skip).limit(size).populate({
            path: 'profile',
            select: ['fullName', 'avatar']
        });
        const to = skip + users.length;

        return {users, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }
}

const findUserById = async (params) => {
    try {
        return await User.findById(params.id).populate({
            path: 'profile',
            select: ['fullName', 'avatar']
        });
    } catch (error) {
        throw error;
    }
}

const updateUser = async (req) => {
    try {
        const filterObj = filterReqObj(req.body, 'role');

        return await User.findByIdAndUpdate(req.params.id, filterObj, {new: true, runValidators: true});
    } catch (error) {
        throw error;
    }
}

const updateUserByAuthUser = async (req) => {
    try {
        const filterObj = filterReqObj(req.body, 'username');

        return await User.findByIdAndUpdate(req.user.id, filterObj, {new: true, runValidators: true});
    } catch (error) {
        throw error;
    }
}

const changeUserPasswordByAuthUser = async (req) => {
    try {
        const userData = req.body;

        const user = await User.findById(req.user._id).select('+password');

        const isMatch = await passwordHash.verifyPassword(userData.currentPassword, user.password);

        if (!isMatch) throw new UnauthorizedAccessError('The current password you provided is wrong!');

        user.password = await passwordHash.hashPassword(userData.password);
        user.passwordChangedAt = Date.now();

        return await user.save();
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
    findAllUsersWithPagination,
    findAllUsersBySearchWithPagination,
    findUserById,
    updateUser,
    updateUserByAuthUser,
    changeUserPasswordByAuthUser,
    deleteUser
}