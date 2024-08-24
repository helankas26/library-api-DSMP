const reservationRepository = require('../repositories/ReservationRepository');

const findAllReservations = async () => {
    try {
        return await reservationRepository.findAllReservations();
    } catch (error) {
        throw error;
    }
}

const findAllReservationsWithPagination = async (req) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 24;

    try {
        return await reservationRepository.findAllReservationsWithPagination(page, size);
    } catch (error) {
        throw error;
    }
}

const findAllReservationsBySearchWithPagination = async (req) => {
    const searchText = req.query.searchText;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 24;

    try {
        return await reservationRepository.findAllReservationsBySearchWithPagination(searchText, page, size);
    } catch (error) {
        throw error;
    }
}

const findAllReservationsWithPaginationByAuthUser = async (req) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 24;

    try {
        return await reservationRepository.findAllReservationsWithPaginationByAuthUser(req, page, size);
    } catch (error) {
        throw error;
    }
}

const findAllReservationsBySearchWithPaginationByAuthUser = async (req) => {
    const searchText = req.query.searchText;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 24;

    try {
        return await reservationRepository.findAllReservationsBySearchWithPaginationByAuthUser(req, searchText, page, size);
    } catch (error) {
        throw error;
    }
}

const createReservation = async (req) => {
    try {
        return await reservationRepository.createReservation(req);
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

const findReservationByIdWithByAuthUser = async (req) => {
    try {
        return await reservationRepository.findReservationByIdWithByAuthUser(req);
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

const updateReservationByAuthUser = async (req) => {
    try {
        return await reservationRepository.updateReservationByAuthUser(req);
    } catch (error) {
        throw error;
    }
}

const expireReservations = async () => {
    try {
        return await reservationRepository.expireReservations();
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
    findAllReservations,
    findAllReservationsWithPagination,
    findAllReservationsBySearchWithPagination,
    findAllReservationsWithPaginationByAuthUser,
    findAllReservationsBySearchWithPaginationByAuthUser,
    createReservation,
    findReservationById,
    findReservationByIdWithByAuthUser,
    updateReservation,
    updateReservationByAuthUser,
    expireReservations,
    deleteReservation
}