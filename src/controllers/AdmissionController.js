const admissionService = require('../services/AdmissionService');

const findAllAdmissions = (req, resp) => {
    admissionService.findAllAdmissions().then(admissions => {
        resp.status(200).json({
            'status': 'success',
            'data': {
                admissions,
                count: admissions.length
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}
const createAdmission = (req, resp) => {
    admissionService.createAdmission(req.body).then(admission => {
        resp.status(201).json({
            'status': 'success',
            'data': {
                admission
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

const findAdmissionById = (req, resp) => {
    admissionService.findAdmissionById(req.params).then(admission => {
        resp.status(200).json({
            'status': 'success',
            'data': {
                admission
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

const updateAdmission = (req, resp) => {
    admissionService.updateAdmission(req.params, req.body).then(admission => {
        resp.status(201).json({
            'status': 'success',
            'data': {
                admission
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

const deleteAdmission = (req, resp) => {
    admissionService.deleteAdmission(req.params).then(admission => {
        resp.status(200).json({
            'status': 'success',
            'data': {
                'id': admission._id
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
    findAllAdmissions, createAdmission, findAdmissionById, updateAdmission, deleteAdmission
}