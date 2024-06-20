const Profile = require('../models/ProfileSchema');
const User = require('../models/UserSchema');
const idGenerate = require("../utils/IdGenerateUtil");
const UnprocessableError = require("../errors/UnprocessableError");
const Admission = require("../models/AdmissionSchema");
const Config = require("../models/ConfigSchema");

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

const createProfile = async (req) => {
    const profileData = req.body;

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

        const savedProfile = await profile.save();
        if (!savedProfile) {
            throw new Error("Could not create profile. Try again!");
        }

        if (savedProfile.type === 'MEMBER') {
            try {
                const admission = new Admission({
                    fee: await (async () => {
                        const config = await Config.findOne();
                        return config.admission.fee;
                    })(),
                    member: savedProfile._id,
                    librarian: req.user.profile
                });

                const savedAdmission = await admission.save();
                if (!savedAdmission) {
                    throw new Error('Admission unpaid. Could not create profile. Try again!');
                }

                return {savedProfile, savedAdmission};
            } catch (error) {
                await Profile.findByIdAndDelete(savedProfile._id);
                throw error;
            }
        }

        return {savedProfile, undefined};
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
        const user = await User.findOne({profile: params.id});

        if (user) {
            throw new UnprocessableError('Could not delete. This profile associated with user account!');
        }
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