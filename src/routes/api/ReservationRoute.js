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

router.route('/:id')
    .get(authMiddleware.checkPermission('ADMIN'), reservationController.findReservationById)
    .patch(authMiddleware.checkPermission('ADMIN'), reservationController.updateReservation)
    .delete(authMiddleware.checkPermission('ADMIN'), reservationController.deleteReservation);

module.exports = router;