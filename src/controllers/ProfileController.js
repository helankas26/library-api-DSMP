const profileService = require('../services/ProfileService');
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const {sendResponse} = require("../utils/SendResponseUtil");


const findAllProfiles = asyncErrorHandler(async (req, resp, next) => {
    const profiles = await profileService.findAllProfiles();
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

const createProfile = asyncErrorHandler(async (req, resp, next) => {
    const profileWithAdmission = await profileService.createProfile(req);
    await sendResponse(resp, 201, profileWithAdmission);
});

const findProfileById = asyncErrorHandler(async (req, resp, next) => {
    const profile = await profileService.findProfileById(req.params);
    await sendResponse(resp, 200, {profile});
});

const findProfileByAuthUser = asyncErrorHandler(async (req, resp, next) => {
    const profile = await profileService.findProfileByAuthUser(req);
    await sendResponse(resp, 200, {profile});
});

const updateProfile = asyncErrorHandler(async (req, resp, next) => {
    const profile = await profileService.updateProfile(req.params, req.body);
    await sendResponse(resp, 201, {profile});
});

const deleteProfile = asyncErrorHandler(async (req, resp, next) => {
    const profile = await profileService.deleteProfile(req.params);
    await sendResponse(resp, 204, {id: profile.id});
});

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