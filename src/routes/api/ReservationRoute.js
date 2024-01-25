const express = require('express');

const reservationController = require('../../controllers/ReservationController');
const paramMiddleware = require('../../middlewares/ParamMiddleware');
const Reservation = require('../../models/ReservationSchema')

const router = express.Router();

router.param('id', async (req, res, next, value) => {
    await paramMiddleware.verifyId(req, res, next, value, Reservation);
});

router.route('/')
    .get(reservationController.findAllReservations)
    .post(reservationController.createReservation);

router.route('/:id')
    .get(reservationController.findReservationById)
    .patch(reservationController.updateReservation)
    .delete(reservationController.deleteReservation);

module.exports = router;