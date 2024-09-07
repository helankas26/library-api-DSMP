const express = require('express');

const reservationController = require('../../controllers/ReservationController');
const paramMiddleware = require('../../middlewares/ParamMiddleware');
const authMiddleware = require('../../middlewares/AuthMiddleware');
const Reservation = require('../../models/ReservationSchema')

const router = express.Router();

router.param('id', async (req, res, next, value) => {
    await paramMiddleware.verifyId(req, res, next, value, Reservation);
});

router.use(authMiddleware.verifyToken);

router.route('/')
    .get(authMiddleware.checkPermission('ADMIN'), reservationController.findAllReservations)
    .post(authMiddleware.checkPermission('USER'), reservationController.createReservation);

router.route('/list')
    .get(authMiddleware.checkPermission('ADMIN'), reservationController.findAllReservationsWithPagination);

router.route('/query')
    .get(authMiddleware.checkPermission('ADMIN'), reservationController.findAllReservationsBySearchWithPagination);

router.route('/auth/list')
    .get(authMiddleware.checkPermission('USER'), reservationController.findAllReservationsWithPaginationByAuthUser);
router.route('/auth/query')
    .get(authMiddleware.checkPermission('USER'), reservationController.findAllReservationsBySearchWithPaginationByAuthUser);

router.route('/reserved')
    .get(authMiddleware.checkPermission('ADMIN', 'USER'), reservationController.findAllReserved);

router.route('/cron-job')
    .patch(authMiddleware.checkPermission('ADMIN'), reservationController.expireReservations);

router.route('/:id')
    .get(authMiddleware.checkPermission('ADMIN'), reservationController.findReservationById)
    .patch(authMiddleware.checkPermission('ADMIN'), reservationController.updateReservation)
    .delete(authMiddleware.checkPermission('ADMIN'), reservationController.deleteReservation);

router.route('/:id/auth')
    .get(authMiddleware.checkPermission('USER'), reservationController.findReservationByIdWithByAuthUser)
    .patch(authMiddleware.checkPermission('USER'), reservationController.updateReservationByAuthUser);

module.exports = router;