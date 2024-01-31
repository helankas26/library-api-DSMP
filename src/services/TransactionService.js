const transactionRepository = require('../repositories/TransactionRepository');

const findAllTransactions = async () => {
    try {
        return await transactionRepository.findAllTransactions();
    } catch (error) {
        throw error;
    }
}

const createTransaction = async (req) => {
    try {
        return await transactionRepository.createTransaction(req);
    } catch (error) {
        throw error;
    }
}

const findTransactionById = async (reqParams) => {
    try {
        return await transactionRepository.findTransactionById(reqParams);
    } catch (error) {
        throw error;
    }
}

const updateTransaction = async (reqParams, req) => {
    try {
        return await transactionRepository.updateTransaction(reqParams, req);
    } catch (error) {
        throw error;
    }
}

const deleteTransaction = async (reqParams) => {
    try {
        return await transactionRepository.deleteTransaction(reqParams);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findAllTransactions, createTransaction, findTransactionById, updateTransaction, deleteTransaction
}