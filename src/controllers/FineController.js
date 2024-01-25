const fineService = require('../services/FineService');

const findAllFines = (req, resp) => {
    fineService.findAllFines().then(fines => {
        resp.status(200).json({
            'status': 'success',
            'data': {
                fines,
                count: fines.length
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}
const createFine = (req, resp) => {
    fineService.createFine(req.body).then(fine => {
        resp.status(201).json({
            'status': 'success',
            'data': {
                fine
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

const findFineById = (req, resp) => {
    fineService.findFineById(req.params).then(fine => {
        resp.status(200).json({
            'status': 'success',
            'data': {
                fine
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

const updateFine = (req, resp) => {
    fineService.updateFine(req.params, req.body).then(fine => {
        resp.status(201).json({
            'status': 'success',
            'data': {
                fine
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

const deleteFine = (req, resp) => {
    fineService.deleteFine(req.params).then(fine => {
        resp.status(200).json({
            'status': 'success',
            'data': {
                'id': fine._id
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
    findAllFines, createFine, findFineById, updateFine, deleteFine
}