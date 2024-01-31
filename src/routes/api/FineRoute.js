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

router.route('/:id')
    .get(authMiddleware.checkPermission('ADMIN'), fineController.findFineById)
    .patch(authMiddleware.checkPermission('ADMIN'), fineController.updateFine)
    .delete(authMiddleware.checkPermission('ADMIN'), fineController.deleteFine);

module.exports = router;