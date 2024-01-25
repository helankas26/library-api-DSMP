const reservationService = require('../services/ReservationService');

const findAllReservations = (req, resp) => {
    reservationService.findAllReservations().then(reservations => {
        resp.status(200).json({
            'status': 'success',
            'data': {
                reservations,
                count: reservations.length
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}
const createReservation = (req, resp) => {
    reservationService.createReservation(req.body).then(reservation => {
        resp.status(201).json({
            'status': 'success',
            'data': {
                reservation
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

const findReservationById = (req, resp) => {
    reservationService.findReservationById(req.params).then(reservation => {
        resp.status(200).json({
            'status': 'success',
            'data': {
                reservation
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

const updateReservation = (req, resp) => {
    reservationService.updateReservation(req.params, req.body).then(reservation => {
        resp.status(201).json({
            'status': 'success',
            'data': {
                reservation
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

const deleteReservation = (req, resp) => {
    reservationService.deleteReservation(req.params).then(reservation => {
        resp.status(200).json({
            'status': 'success',
            'data': {
                'id': reservation._id
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

module.exports = {
    findAllReservations, createReservation, findReservationById, updateReservation, deleteReservation
}