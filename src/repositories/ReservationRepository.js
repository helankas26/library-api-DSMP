const Reservation = require('../models/ReservationSchema');

const findAllReservations = async () => {
    try {
        return await Reservation.find();
    } catch (error) {
        throw error;
    }
}

const createReservation = async (req) => {
    try {
        const reservationData = req.body;
        const reservation = new Reservation({
            book: reservationData.book,
            member: req.user.profile
        });

        return await reservation.save();
    } catch (error) {
        throw error;
    }
}

const findReservationById = async (params) => {
    try {
        return await Reservation.findById(params.id);
    } catch (error) {
        throw error;
    }
}

const updateReservation = async (params, reservationData) => {
    try {
        return await Reservation.findByIdAndUpdate(params.id, reservationData, {new: true, runValidators: true});
    } catch (error) {
        throw error;
    }
}

const deleteReservation = async (params) => {
    try {
        return await Reservation.findByIdAndDelete(params.id);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findAllReservations, createReservation, findReservationById, updateReservation, deleteReservation
}