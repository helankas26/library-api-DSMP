const profileService = require('../services/ProfileService');
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const {sendResponse} = require("../utils/SendResponseUtil");


const findAllProfiles = asyncErrorHandler(async (req, resp, next) => {
    const profiles = await profileService.findAllProfiles();
    await sendResponse(resp, 200, {profiles: profiles, count: profiles.length});
});

const findAllMembers = asyncErrorHandler(async (req, resp, next) => {
    const profiles = await profileService.findAllMembers();
    await sendResponse(resp, 200, {profiles: profiles, count: profiles.length});
});

const findAllProfilesWithPagination = asyncErrorHandler(async (req, resp, next) => {
    const profilesWithPagination = await profileService.findAllProfilesWithPagination(req);
    await sendResponse(resp, 200, profilesWithPagination);
});

const findAllProfilesBySearchWithPagination = asyncErrorHandler(async (req, resp, next) => {
    const profilesWithPagination = await profileService.findAllProfilesBySearchWithPagination(req);
    await sendResponse(resp, 200, profilesWithPagination);
});

const findAllMembersPaymentStatus = asyncErrorHandler(async (req, resp, next) => {
    const membersPaymentStatus = await profileService.findAllMembersPaymentStatus(req);
    await sendResponse(resp, 200, membersPaymentStatus);
});

const findAllMembersPaymentStatusBySearch = asyncErrorHandler(async (req, resp, next) => {
    const membersPaymentStatus = await profileService.findAllMembersPaymentStatusBySearch(req);
    await sendResponse(resp, 200, membersPaymentStatus);
});

const createProfile = asyncErrorHandler(async (req, resp, next) => {
    const profileWithAdmission = await profileService.createProfile(req);
    await sendResponse(resp, 201, profileWithAdmission);
});

const findProfileById = asyncErrorHandler(async (req, resp, next) => {
    const profile = await profileService.findProfileById(req.params);
    await sendResponse(resp, 200, {profile});
});

const findMemberPaymentStatusById = asyncErrorHandler(async (req, resp, next) => {
    const profile = await profileService.findMemberPaymentStatusById(req.params);
    await sendResponse(resp, 200, {profile});
});

const findProfileByAuthUser = asyncErrorHandler(async (req, resp, next) => {
    const profile = await profileService.findProfileByAuthUser(req);
    await sendResponse(resp, 200, {profile});
});

const getMemberCurrentLoansById = asyncErrorHandler(async (req, resp, next) => {
    const profile = await profileService.getMemberCurrentLoansById(req.params);
    await sendResponse(resp, 200, {profile});
});

const getMemberAvailableReservationsById = asyncErrorHandler(async (req, resp, next) => {
    const profile = await profileService.getMemberAvailableReservationsById(req.params);
    await sendResponse(resp, 200, {profile});
});

const updateProfile = asyncErrorHandler(async (req, resp, next) => {
    const profile = await profileService.updateProfile(req.params, req.body);
    await sendResponse(resp, 201, {profile});
});

const updateProfileByAuthUser = asyncErrorHandler(async (req, resp, next) => {
    const profile = await profileService.updateProfileByAuthUser(req);
    await sendResponse(resp, 201, {profile});
});

const incrementPaymentStatus = asyncErrorHandler(async (req, resp, next) => {
    const profiles = await profileService.incrementPaymentStatus();
    await sendResponse(resp, 201, {profiles});
});

const deleteProfile = asyncErrorHandler(async (req, resp, next) => {
    const profile = await profileService.deleteProfile(req.params);
    await sendResponse(resp, 204, {id: profile.id});
});

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
    updateProfileByAuthUser,
    incrementPaymentStatus,
    deleteProfile
}