const Profile = require('../models/ProfileSchema');
const idGenerate = require("../utils/IdGenerateUtil");

const findAllProfiles = async () => {
    try {
        return await Profile.find();
    } catch (error) {
        throw error;
    }
}

const findAllProfilesWithPagination = async (page, size) => {
    try {
        const totalCount = await Profile.countDocuments();
        const totalPages = Math.ceil(totalCount / size);
        const skip = (page - 1) * size;
        const from = skip + 1;

        const profiles = await Profile.find({}).skip(skip).limit(size);
        const to = skip + profiles.length;

        return {profiles, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }
}

const findAllProfilesBySearchWithPagination = async (searchText, page, size) => {
    try {
        const totalCount = await Profile.find({$text: {$search: searchText}}).countDocuments();
        const totalPages = Math.ceil(totalCount / size);
        const skip = (page - 1) * size;
        const from = skip + 1;

        const profiles = await Profile.find({$text: {$search: searchText}}).skip(skip).limit(size);
        const to = skip + profiles.length;

        return {profiles, totalCount, totalPages, from, to};
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

const findProfileByAuthUser = async (req) => {
    try {
        return await Profile.findById(req.user.profile);
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
    findAllProfiles,
    findAllProfilesWithPagination,
    findAllProfilesBySearchWithPagination,
    createProfile,
    findProfileById,
    findProfileByAuthUser,
    updateProfile,
    deleteProfile
}