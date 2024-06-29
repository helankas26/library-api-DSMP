const profileRepository = require('../repositories/ProfileRepository');
const {sendEmail} = require("../utils/EmailSenderUtil");

const findAllProfiles = async () => {
    try {
        return await profileRepository.findAllProfiles();
    } catch (error) {
        throw error;
    }
}

const findAllMembers = async () => {
    try {
        return await profileRepository.findAllMembers();
    } catch (error) {
        throw error;
    }
}

const findAllProfilesWithPagination = async (req) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 24;

    try {
        return await profileRepository.findAllProfilesWithPagination(page, size);
    } catch (error) {
        throw error;
    }
}

const findAllProfilesBySearchWithPagination = async (req) => {
    const searchText = req.query.searchText;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 24;

    try {
        return await profileRepository.findAllProfilesBySearchWithPagination(searchText, page, size);
    } catch (error) {
        throw error;
    }
}

const findAllMembersPaymentStatus = async (req) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 24;

    try {
        return await profileRepository.findAllMembersPaymentStatus(page, size);
    } catch (error) {
        throw error;
    }
}

const findAllMembersPaymentStatusBySearch = async (req) => {
    const searchText = req.query.searchText;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 24;

    try {
        return await profileRepository.findAllMembersPaymentStatusBySearch(searchText, page, size);
    } catch (error) {
        throw error;
    }
}

const createProfile = async (req) => {
    try {
        const profileWithAdmission = await profileRepository.createProfile(req);
        const {savedProfile: profile, savedAdmission: admission} = profileWithAdmission;

        const message = `You have been successfully registered for our Library. Please use the below registration ID to create account.\n\n\t\t\tYour Registration ID is: ${profile.id}\n\nPlease visit to ${req.headers.origin} to signup.`;

        try {
            await sendEmail({
                email: profile.email,
                subject: 'New Account Creation',
                message: message
            });

            return {profile, admission};
        } catch {
            throw new Error('There was an error sending account creation email. Please try again later');
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

const findMemberPaymentStatusById = async (reqParams) => {
    try {
        return await profileRepository.findMemberPaymentStatusById(reqParams);
    } catch (error) {
        throw error;
    }
}

const findProfileByAuthUser = async (req) => {
    try {
        return await profileRepository.findProfileByAuthUser(req);
    } catch (error) {
        throw error;
    }
}

const getMemberCurrentLoansById = async (reqParams) => {
    try {
        return await profileRepository.getMemberCurrentLoansById(reqParams);
    } catch (error) {
        throw error;
    }
}

const getMemberAvailableReservationsById = async (reqParams) => {
    try {
        return await profileRepository.getMemberAvailableReservationsById(reqParams);
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
    findAllProfiles,
    findAllMembers,
    findAllProfilesWithPagination,
    findAllProfilesBySearchWithPagination,
    findAllMembersPaymentStatus,
    findAllMembersPaymentStatusBySearch,
    createProfile,
    findProfileById,
    findMemberPaymentStatusById,
    findProfileByAuthUser,
    getMemberCurrentLoansById,
    getMemberAvailableReservationsById,
    updateProfile,
    deleteProfile
}