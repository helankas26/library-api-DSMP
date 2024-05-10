const express = require('express');

const profileController = require('../../controllers/ProfileController');
const paramMiddleware = require('../../middlewares/ParamMiddleware');
const authMiddleware = require('../../middlewares/AuthMiddleware');
const Profile = require('../../models/ProfileSchema');

const router = express.Router();

router.param('id', async (req, res, next, value) => {
    await paramMiddleware.verifyId(req, res, next, value, Profile);
});

router.use(authMiddleware.verifyToken);

router.route('/')
    .get(authMiddleware.checkPermission('ADMIN'), profileController.findAllProfiles)
    .post(authMiddleware.checkPermission('ADMIN'), profileController.createProfile);

router.route('/auth') .get(authMiddleware.checkPermission('ADMIN', 'USER'), profileController.findProfileByAuthUser);

router.route('/:id')
    .get(authMiddleware.checkPermission('ADMIN'), profileController.findProfileById)
    .patch(authMiddleware.checkPermission('ADMIN'), profileController.updateProfile)
    .delete(authMiddleware.checkPermission('ADMIN'), profileController.deleteProfile);

module.exports = router;