const transactionRepository = require('../repositories/TransactionRepository');

const findAllTransactions = async () => {
    try {
        return await transactionRepository.findAllTransactions();
    } catch (error) {
        throw error;
    }
}

const createTransaction = async (reqBody) => {
    try {
        return await transactionRepository.createTransaction(reqBody);
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

const updateTransaction = async (reqParams, reqBody) => {
    try {
        return await transactionRepository.updateTransaction(reqParams, reqBody);
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