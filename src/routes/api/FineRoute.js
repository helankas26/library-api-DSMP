const express = require('express');

const fineController = require('../../controllers/FineController');
const paramMiddleware = require('../../middlewares/ParamMiddleware');
const authMiddleware = require('../../middlewares/AuthMiddleware');
const Fine = require('../../models/FineSchema')

const router = express.Router();

router.param('id', async (req, res, next, value) => {
    await paramMiddleware.verifyId(req, res, next, value, Fine);
});

router.use(authMiddleware.verifyToken);

router.route('/')
    .get(authMiddleware.checkPermission('ADMIN'), fineController.findAllFines)
    .post(authMiddleware.checkPermission('ADMIN'), fineController.createFine);

router.route('/list')
    .get(authMiddleware.checkPermission('ADMIN'), fineController.findAllFinesWithPagination);

router.route('/query')
    .get(authMiddleware.checkPermission('ADMIN'), fineController.findAllFinesBySearchWithPagination);

router.route('/auth/list')
    .get(authMiddleware.checkPermission('USER'), fineController.findAllFinesWithPaginationByAuthUser);
router.route('/auth/query')
    .get(authMiddleware.checkPermission('USER'), fineController.findAllFinesBySearchWithPaginationByAuthUser);

router.route('/today-collection')
    .get(authMiddleware.checkPermission('ADMIN'), fineController.getTodayFinesCollection);

router.route('/:id')
    .get(authMiddleware.checkPermission('ADMIN'), fineController.findFineById)
    .patch(authMiddleware.checkPermission('ADMIN'), fineController.updateFine)
    .delete(authMiddleware.checkPermission('ADMIN'), fineController.deleteFine);

router.route('/:id/auth')
    .get(authMiddleware.checkPermission('USER'), fineController.findFineByIdWithByAuthUser);

module.exports = router;