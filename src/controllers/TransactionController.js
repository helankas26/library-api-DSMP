const transactionService = require('../services/TransactionService');
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const {sendResponse} = require("../utils/SendResponseUtil");


const findAllTransactions = asyncErrorHandler(async (req, resp, next) => {
    const transactions = await transactionService.findAllTransactions();
    await sendResponse(resp, 200, {transactions: transactions, count: transactions.length});
});

const findAllTransactionsWithPagination = asyncErrorHandler(async (req, resp, next) => {
    const transactionsWithPagination = await transactionService.findAllTransactionsWithPagination(req);
    await sendResponse(resp, 200, transactionsWithPagination);
});

const findAllTransactionsBySearchWithPagination = asyncErrorHandler(async (req, resp, next) => {
    const transactionsWithPagination = await transactionService.findAllTransactionsBySearchWithPagination(req);
    await sendResponse(resp, 200, transactionsWithPagination);
});

const findAllTransactionsWithPaginationByAuthUser = asyncErrorHandler(async (req, resp, next) => {
    const transactionsWithPagination = await transactionService.findAllTransactionsWithPaginationByAuthUser(req);
    await sendResponse(resp, 200, transactionsWithPagination);
});

const findAllTransactionsBySearchWithPaginationByAuthUser = asyncErrorHandler(async (req, resp, next) => {
    const transactionsWithPagination = await transactionService.findAllTransactionsBySearchWithPaginationByAuthUser(req);
    await sendResponse(resp, 200, transactionsWithPagination);
});

const createTransaction = asyncErrorHandler(async (req, resp, next) => {
    const transaction = await transactionService.createTransaction(req);
    await sendResponse(resp, 201, {transaction});
});

const findTransactionById = asyncErrorHandler(async (req, resp, next) => {
    const transaction = await transactionService.findTransactionById(req.params);
    await sendResponse(resp, 200, {transaction});
});

const findTransactionByIdWithByAuthUser = asyncErrorHandler(async (req, resp, next) => {
    const transaction = await transactionService.findTransactionByIdWithByAuthUser(req);
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

const overdueTransactions = asyncErrorHandler(async (req, resp, next) => {
    const transactions = await transactionService.overdueTransactions();
    await sendResponse(resp, 201, {transactions});
});

const deleteTransaction = asyncErrorHandler(async (req, resp, next) => {
    const transaction = await transactionService.deleteTransaction(req.params);
    await sendResponse(resp, 204, {id: transaction.id});
});

module.exports = {
    findAllTransactions,
    findAllTransactionsWithPagination,
    findAllTransactionsBySearchWithPagination,
    findAllTransactionsWithPaginationByAuthUser,
    findAllTransactionsBySearchWithPaginationByAuthUser,
    createTransaction,
    findTransactionById,
    findTransactionByIdWithByAuthUser,
    getTransactionFineDetailsById,
    updateTransaction,
    overdueTransactions,
    deleteTransaction
}