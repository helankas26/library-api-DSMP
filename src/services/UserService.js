const userRepository = require('../repositories/UserRepository');
const PasswordDoesNotMatchError = require("../errors/PasswordDoesNotMatchError");
const tokenGenerate = require("../utils/TokenGenerateUtil");
const crypto = require("crypto");


const findAllUsers = async () => {
    try {
        return await userRepository.findAllUsers();
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

const updateUser = async (req) => {
    try {
        return await userRepository.updateUser(req);
    } catch (error) {
        throw error;
    }
}

const changeUserPassword = async (req, res) => {
    try {
        if (req.body.password !== req.body.confirmPassword) throw new PasswordDoesNotMatchError('Password does not match!');

        let user = await userRepository.changeUserPassword(req);

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
    findAllUsers, findUserById, updateUser, changeUserPassword, deleteUser
}