const Profile = require('../models/ProfileSchema');
const idGenerate = require("../utils/IdGenerateUtil");

const findAllProfiles = async () => {
    try {
        return await Profile.find();
    } catch (error) {
        throw error;
    }
}

const createProfile = async (profileData) => {
    try {
        const profile = new Profile({
            _id: await idGenerate.generateId(new Date(), await Profile.findByCreatedAtForCurrentMonth()),
            fullName: profileData.fullName,
            avatar: profileData.avatar,
            email: profileData.email,
            telNo: profileData.telNo,
            address: profileData.address,
            type: profileData.type
        });

        return await profile.save();
    } catch (error) {
        throw error;
    }
}

const findProfileById = async (params) => {
    try {
        return await Profile.findById(params.id);
    } catch (error) {
        throw error;
    }
}

const updateProfile = async (params, profileData) => {
    try {
        return await Profile.findByIdAndUpdate(params.id, profileData, {new: true, runValidators: true});
    } catch (error) {
        throw error;
    }
}

const deleteProfile = async (params) => {
    try {
        return await Profile.findByIdAndDelete(params.id);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findAllProfiles, createProfile, findProfileById, updateProfile, deleteProfile
}