const express = require('express');

const admissionController = require('../../controllers/AdmissionController');
const paramMiddleware = require('../../middlewares/ParamMiddleware');
const authMiddleware = require('../../middlewares/AuthMiddleware');
const Admission = require('../../models/AdmissionSchema')

const router = express.Router();

router.param('id', async (req, res, next, value) => {
    await paramMiddleware.verifyId(req, res, next, value, Admission);
});

router.use(authMiddleware.verifyToken, authMiddleware.checkPermission('ADMIN'));

router.route('/')
    .get(admissionController.findAllAdmissions)
    .post(admissionController.createAdmission);

router.route('/list')
    .get(authMiddleware.checkPermission('ADMIN'), admissionController.findAllAdmissionsWithPagination);

router.route('/query')
    .get(authMiddleware.checkPermission('ADMIN'), admissionController.findAllAdmissionsBySearchWithPagination);

router.route('/:id')
    .get(admissionController.findAdmissionById)
    .patch(admissionController.updateAdmission)
    .delete(admissionController.deleteAdmission);

module.exports = router;