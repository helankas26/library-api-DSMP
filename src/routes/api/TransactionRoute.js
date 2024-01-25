const express = require('express');

const transactionController = require('../../controllers/TransactionController');
const paramMiddleware = require('../../middlewares/ParamMiddleware');
const Transaction = require('../../models/TransactionSchema')

const router = express.Router();

router.param('id', async (req, res, next, value) => {
    await paramMiddleware.verifyId(req, res, next, value, Transaction);
});

router.route('/')
    .get(transactionController.findAllTransactions)
    .post(transactionController.createTransaction);

router.route('/:id')
    .get(transactionController.findTransactionById)
    .patch(transactionController.updateTransaction)
    .delete(transactionController.deleteTransaction);

module.exports = router;