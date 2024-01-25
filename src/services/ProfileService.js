const profileRepository = require('../repositories/ProfileRepository');

const findAllProfiles = async () => {
    try {
        return await profileRepository.findAllProfiles();
    } catch (error) {
        throw error;
    }
}

const createProfile = async (reqBody) => {
    try {
        return await profileRepository.createProfile(reqBody);
    } catch (error) {
        throw error;
    }
}

const findProfileById = async (reqParams) => {
    try {
        return await profileRepository.findProfileById(reqParams);
    } catch (error) {
        throw error;
    }
}

const updateProfile = async (reqParams, reqBody) => {
    try {
        return await profileRepository.updateProfile(reqParams, reqBody);
    } catch (error) {
        throw error;
    }
}

const deleteProfile = async (reqParams) => {
    try {
        return await profileRepository.deleteProfile(reqParams);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findAllProfiles, createProfile, findProfileById, updateProfile, deleteProfile
}