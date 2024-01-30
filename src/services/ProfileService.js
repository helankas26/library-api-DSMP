const profileRepository = require('../repositories/ProfileRepository');
const {sendEmail} = require("../utils/EmailSenderUtil");

const findAllProfiles = async () => {
    try {
        return await profileRepository.findAllProfiles();
    } catch (error) {
        throw error;
    }
}

const createProfile = async (reqBody) => {
    try {
        const profile = await profileRepository.createProfile(reqBody);

        const message = `You have been successfully registered for our Library. Please use the below registration ID to create account.\n\n\t\t\tYour Registration ID is: ${profile.id}`;

        try {
            await sendEmail({
                email: profile.email,
                subject: 'New Account Creation',
                message: message
            });

            return profile;
        } catch {
            throw new Error('There was an error sending password reset email. Please try again later');
        }
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