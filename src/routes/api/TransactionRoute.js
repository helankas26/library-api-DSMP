const express = require('express');

const transactionController = require('../../controllers/TransactionController');
const paramMiddleware = require('../../middlewares/ParamMiddleware');
const authMiddleware = require('../../middlewares/AuthMiddleware')
const Transaction = require('../../models/TransactionSchema')

const router = express.Router();

router.param('id', async (req, res, next, value) => {
    await paramMiddleware.verifyId(req, res, next, value, Transaction);
});

router.use(authMiddleware.verifyToken);

router.route('/')
    .get(authMiddleware.checkPermission('ADMIN'), transactionController.findAllTransactions)
    .post(authMiddleware.checkPermission('ADMIN'), transactionController.createTransaction);

router.route('/list')
    .get(authMiddleware.checkPermission('ADMIN'), transactionController.findAllTransactionsWithPagination);

router.route('/query')
    .get(authMiddleware.checkPermission('ADMIN'), transactionController.findAllTransactionsBySearchWithPagination);

router.route('/auth/list')
    .get(authMiddleware.checkPermission('USER'), transactionController.findAllTransactionsWithPaginationByAuthUser);
router.route('/auth/query')
    .get(authMiddleware.checkPermission('USER'), transactionController.findAllTransactionsBySearchWithPaginationByAuthUser);

router.route('/overdue')
    .get(authMiddleware.checkPermission('ADMIN', 'USER'), transactionController.findAllOverdue);

router.route('/cron-job')
    .patch(authMiddleware.checkPermission('ADMIN'), transactionController.overdueTransactions);

router.route('/:id')
    .get(authMiddleware.checkPermission('ADMIN'), transactionController.findTransactionById)
    .patch(authMiddleware.checkPermission('ADMIN'), transactionController.updateTransaction)
    .delete(authMiddleware.checkPermission('ADMIN'), transactionController.deleteTransaction);

router.route('/:id/auth')
    .get(authMiddleware.checkPermission('USER'), transactionController.findTransactionByIdWithByAuthUser);

router.route('/:id/fines')
    .get(authMiddleware.checkPermission('ADMIN'), transactionController.getTransactionFineDetailsById);

module.exports = router;