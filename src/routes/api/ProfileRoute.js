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

router.route('/members')
    .get(authMiddleware.checkPermission('ADMIN'), profileController.findAllMembers);

router.route('/list')
    .get(authMiddleware.checkPermission('ADMIN'), profileController.findAllProfilesWithPagination);

router.route('/query')
    .get(authMiddleware.checkPermission('ADMIN'), profileController.findAllProfilesBySearchWithPagination);

router.route('/payment-status/list')
    .get(authMiddleware.checkPermission('ADMIN'), profileController.findAllMembersPaymentStatus);
router.route('/payment-status/query')
    .get(authMiddleware.checkPermission('ADMIN'), profileController.findAllMembersPaymentStatusBySearch);
router.route('/payment-status/arrears')
    .get(authMiddleware.checkPermission('ADMIN', 'USER'), profileController.findAllPaymentArrears);

router.route('/auth')
    .get(authMiddleware.checkPermission('ADMIN', 'USER'), profileController.findProfileByAuthUser)
    .patch(authMiddleware.checkPermission('ADMIN', 'USER'), profileController.updateProfileByAuthUser);

router.route('/cron-job')
    .patch(authMiddleware.checkPermission('ADMIN'), profileController.incrementPaymentStatus);

router.route('/:id')
    .get(authMiddleware.checkPermission('ADMIN'), profileController.findProfileById)
    .patch(authMiddleware.checkPermission('ADMIN'), profileController.updateProfile)
    .delete(authMiddleware.checkPermission('ADMIN'), profileController.deleteProfile);

router.route('/:id/payment-status')
    .get(authMiddleware.checkPermission('ADMIN'), profileController.findMemberPaymentStatusById);

router.route('/:id/transactions')
    .get(authMiddleware.checkPermission('ADMIN'), profileController.getMemberCurrentLoansById);

router.route('/:id/reservations')
    .get(authMiddleware.checkPermission('ADMIN'), profileController.getMemberAvailableReservationsById);

module.exports = router;