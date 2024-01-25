const reservationRepository = require('../repositories/ReservationRepository');

const findAllReservations = async () => {
    try {
        return await reservationRepository.findAllReservations();
    } catch (error) {
        throw error;
    }
}

const createReservation = async (reqBody) => {
    try {
        return await reservationRepository.createReservation(reqBody);
    } catch (error) {
        throw error;
    }
}

const findReservationById = async (reqParams) => {
    try {
        return await reservationRepository.findReservationById(reqParams);
    } catch (error) {
        throw error;
    }
}

const updateReservation = async (reqParams, reqBody) => {
    try {
        return await reservationRepository.updateReservation(reqParams, reqBody);
    } catch (error) {
        throw error;
    }
}

const deleteReservation = async (reqParams) => {
    try {
        return await reservationRepository.deleteReservation(reqParams);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findAllReservations, createReservation, findReservationById, updateReservation, deleteReservation
}