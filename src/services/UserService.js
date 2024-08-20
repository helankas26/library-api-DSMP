const crypto = require("crypto");

const userRepository = require('../repositories/UserRepository');
const PasswordDoesNotMatchError = require("../errors/PasswordDoesNotMatchError");
const tokenGenerate = require("../utils/TokenGenerateUtil");


const findAllUsers = async () => {
    try {
        return await userRepository.findAllUsers();
    } catch (error) {
        throw error;
    }
}

const findAllUsersWithPagination = async (req) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 24;

    try {
        return await userRepository.findAllUsersWithPagination(page, size);
    } catch (error) {
        throw error;
    }
}

const findAllUsersBySearchWithPagination = async (req) => {
    const searchText = req.query.searchText;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 24;

    try {
        return await userRepository.findAllUsersBySearchWithPagination(searchText, page, size);
    } catch (error) {
        throw error;
    }
}

const findUserById = async (reqParams) => {
    try {
        return await userRepository.findUserById(reqParams);
    } catch (error) {
        throw error;
    }
}

const findUserByAuthUser = async (req) => {
    try {
        return await userRepository.findUserByAuthUser(req);
    } catch (error) {
        throw error;
    }
}

const updateUser = async (req) => {
    try {
        return await userRepository.updateUser(req);
    } catch (error) {
        throw error;
    }
}

const updateUserByAuthUser = async (req) => {
    try {
        return await userRepository.updateUserByAuthUser(req);
    } catch (error) {
        throw error;
    }
}

const changeUserPasswordByAuthUser = async (req, res) => {
    try {
        if (req.body.password !== req.body.confirmPassword) throw new PasswordDoesNotMatchError('Password does not match!');

        let user = await userRepository.changeUserPasswordByAuthUser(req);

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

const deleteUser = async (reqParams) => {
    try {
        return await userRepository.deleteUser(reqParams);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findAllUsers,
    findAllUsersWithPagination,
    findAllUsersBySearchWithPagination,
    findUserById,
    findUserByAuthUser,
    updateUser,
    updateUserByAuthUser,
    changeUserPasswordByAuthUser,
    deleteUser
}