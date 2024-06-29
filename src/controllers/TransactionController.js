const transactionService = require('../services/TransactionService');
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const {sendResponse} = require("../utils/SendResponseUtil");


const findAllTransactions = asyncErrorHandler(async (req, resp, next) => {
    const transactions = await transactionService.findAllTransactions();
    await sendResponse(resp, 200, {transactions: transactions, count: transactions.length});
});

const createTransaction = asyncErrorHandler(async (req, resp, next) => {
    const transaction = await transactionService.createTransaction(req);
    await sendResponse(resp, 201, {transaction});
});

const findTransactionById = asyncErrorHandler(async (req, resp, next) => {
    const transaction = await transactionService.findTransactionById(req.params);
    await sendResponse(resp, 200, {transaction});
});

const getTransactionFineDetailsById = asyncErrorHandler(async (req, resp, next) => {
    const transaction = await transactionService.getTransactionFineDetailsById(req.params);
    await sendResponse(resp, 200, {transaction});
});

const updateTransaction = asyncErrorHandler(async (req, resp, next) => {
    const transaction = await transactionService.updateTransaction(req.params, req);
    await sendResponse(resp, 201, {transaction});
});

const deleteTransaction = asyncErrorHandler(async (req, resp, next) => {
    const transaction = await transactionService.deleteTransaction(req.params);
    await sendResponse(resp, 204, {id: transaction.id});
});

module.exports = {
    findAllTransactions,
    createTransaction,
    findTransactionById,
    getTransactionFineDetailsById,
    updateTransaction,
    deleteTransaction
}