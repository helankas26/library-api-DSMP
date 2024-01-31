const userRepository = require('../repositories/UserRepository');
const PasswordDoesNotMatchError = require("../errors/PasswordDoesNotMatchError");


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

const changeUserPassword = async (req) => {
    try {
        if (req.body.password !== req.body.confirmPassword) throw new PasswordDoesNotMatchError('Password does not match!');

        const user = await userRepository.changeUserPassword(req);

        return user;
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