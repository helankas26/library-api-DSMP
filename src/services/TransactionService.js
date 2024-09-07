const transactionRepository = require('../repositories/TransactionRepository');

const findAllTransactions = async () => {
    try {
        return await transactionRepository.findAllTransactions();
    } catch (error) {
        throw error;
    }
}

const findAllTransactionsWithPagination = async (req) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 24;

    try {
        return await transactionRepository.findAllTransactionsWithPagination(page, size);
    } catch (error) {
        throw error;
    }
}

const findAllTransactionsBySearchWithPagination = async (req) => {
    const searchText = req.query.searchText;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 24;

    try {
        return await transactionRepository.findAllTransactionsBySearchWithPagination(searchText, page, size);
    } catch (error) {
        throw error;
    }
}

const findAllTransactionsWithPaginationByAuthUser = async (req) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 24;

    try {
        return await transactionRepository.findAllTransactionsWithPaginationByAuthUser(req, page, size);
    } catch (error) {
        throw error;
    }
}

const findAllTransactionsBySearchWithPaginationByAuthUser = async (req) => {
    const searchText = req.query.searchText;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 24;

    try {
        return await transactionRepository.findAllTransactionsBySearchWithPaginationByAuthUser(req, searchText, page, size);
    } catch (error) {
        throw error;
    }
}

const findAllOverdue = async (req) => {
    try {
        return await transactionRepository.findAllOverdue(req);
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

const findTransactionByIdWithByAuthUser = async (req) => {
    try {
        return await transactionRepository.findTransactionByIdWithByAuthUser(req);
    } catch (error) {
        throw error;
    }
}

const getTransactionFineDetailsById = async (reqParams) => {
    try {
        return await transactionRepository.getTransactionFineDetailsById(reqParams);
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

const overdueTransactions = async () => {
    try {
        return await transactionRepository.overdueTransactions();
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
    findAllTransactions,
    findAllTransactionsWithPagination,
    findAllTransactionsBySearchWithPagination,
    findAllTransactionsWithPaginationByAuthUser,
    findAllTransactionsBySearchWithPaginationByAuthUser,
    findAllOverdue,
    createTransaction,
    findTransactionById,
    findTransactionByIdWithByAuthUser,
    getTransactionFineDetailsById,
    updateTransaction,
    overdueTransactions,
    deleteTransaction
}