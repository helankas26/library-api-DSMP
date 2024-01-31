const express = require('express');

const admissionController = require('../../controllers/AdmissionController');
const paramMiddleware = require('../../middlewares/ParamMiddleware');
const authMiddleware = require('../../middlewares/AuthMiddleware');
const Admission = require('../../models/AdmissionSchema')

const router = express.Router();

router.param('id', async (req, res, next, value) => {
    await paramMiddleware.verifyId(req, res, next, value, Admission);
});

router.route('/')
    .get(authMiddleware.verifyToken, authMiddleware.checkPermission('ADMIN'), admissionController.findAllAdmissions)
    .post(authMiddleware.verifyToken, authMiddleware.checkPermission('ADMIN'), admissionController.createAdmission);

router.route('/:id')
    .get(authMiddleware.verifyToken, authMiddleware.checkPermission('ADMIN'), admissionController.findAdmissionById)
    .patch(authMiddleware.verifyToken, authMiddleware.checkPermission('ADMIN'), admissionController.updateAdmission)
    .delete(authMiddleware.verifyToken, authMiddleware.checkPermission('ADMIN'), admissionController.deleteAdmission);

module.exports = router;