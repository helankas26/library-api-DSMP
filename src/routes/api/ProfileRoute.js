const express = require('express');

const profileController = require('../../controllers/ProfileController');
const paramMiddleware = require('../../middlewares/ParamMiddleware');
const Profile = require('../../models/ProfileSchema')

const router = express.Router();

router.param('id', async (req, res, next, value) => {
    await paramMiddleware.verifyId(req, res, next, value, Profile);
});

router.route('/')
    .get(profileController.findAllProfiles)
    .post(profileController.createProfile);

router.route('/:id')
    .get(profileController.findProfileById)
    .patch(profileController.updateProfile)
    .delete(profileController.deleteProfile);

module.exports = router;