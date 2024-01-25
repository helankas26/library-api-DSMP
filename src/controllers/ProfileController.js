const profileService = require('../services/ProfileService');

const findAllProfiles = (req, resp) => {
    profileService.findAllProfiles().then(profiles => {
        resp.status(200).json({
            'status': 'success',
            'data': {
                profiles,
                count: profiles.length
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}
const createProfile = (req, resp) => {
    profileService.createProfile(req.body).then(profile => {
        resp.status(201).json({
            'status': 'success',
            'data': {
                profile
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

const findProfileById = (req, resp) => {
    profileService.findProfileById(req.params).then(profile => {
        resp.status(200).json({
            'status': 'success',
            'data': {
                profile
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

const updateProfile = (req, resp) => {
    profileService.updateProfile(req.params, req.body).then(profile => {
        resp.status(201).json({
            'status': 'success',
            'data': {
                profile
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

const deleteProfile = (req, resp) => {
    profileService.deleteProfile(req.params).then(profile => {
        resp.status(200).json({
            'status': 'success',
            'data': {
                'id': profile._id
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

module.exports = {
    findAllProfiles, createProfile, findProfileById, updateProfile, deleteProfile
}