const express = require('express');

const fineController = require('../../controllers/FineController');
const paramMiddleware = require('../../middlewares/ParamMiddleware');
const Fine = require('../../models/FineSchema')

const router = express.Router();

router.param('id', async (req, res, next, value) => {
    await paramMiddleware.verifyId(req, res, next, value, Fine);
});

router.route('/')
    .get(fineController.findAllFines)
    .post(fineController.createFine);

router.route('/:id')
    .get(fineController.findFineById)
    .patch(fineController.updateFine)
    .delete(fineController.deleteFine);

module.exports = router;