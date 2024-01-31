const reservationService = require('../services/ReservationService');
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const {sendResponse} = require("../utils/SendResponseUtil");


const findAllReservations = asyncErrorHandler(async (req, resp, next) => {
    const reservations = await reservationService.findAllReservations();
    await sendResponse(resp, 200, {reservations: reservations, count: reservations.length});
});

const createReservation = asyncErrorHandler(async (req, resp, next) => {
    const reservation = await reservationService.createReservation(req.body);
    await sendResponse(resp, 201, {reservation});
});

const findReservationById = asyncErrorHandler(async (req, resp, next) => {
    const reservation = await reservationService.findReservationById(req.params);
    await sendResponse(resp, 200, {reservation});
});

const updateReservation = asyncErrorHandler(async (req, resp, next) => {
    const reservation = await reservationService.updateReservation(req.params, req.body);
    await sendResponse(resp, 201, {reservation});
});

const deleteReservation = asyncErrorHandler(async (req, resp, next) => {
    const reservation = await reservationService.deleteReservation(req.params);
    await sendResponse(resp, 204, {id: reservation.id});
});

module.exports = {
    findAllReservations, createReservation, findReservationById, updateReservation, deleteReservation
}