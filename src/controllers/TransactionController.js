const transactionService = require('../services/TransactionService');

const findAllTransactions = (req, resp) => {
    transactionService.findAllTransactions().then(transactions => {
        resp.status(200).json({
            'status': 'success',
            'data': {
                transactions,
                count: transactions.length
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}
const createTransaction = (req, resp) => {
    transactionService.createTransaction(req.body).then(transaction => {
        resp.status(201).json({
            'status': 'success',
            'data': {
                transaction
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

const findTransactionById = (req, resp) => {
    transactionService.findTransactionById(req.params).then(transaction => {
        resp.status(200).json({
            'status': 'success',
            'data': {
                transaction
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

const updateTransaction = (req, resp) => {
    transactionService.updateTransaction(req.params, req.body).then(transaction => {
        resp.status(201).json({
            'status': 'success',
            'data': {
                transaction
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

const deleteTransaction = (req, resp) => {
    transactionService.deleteTransaction(req.params).then(transaction => {
        resp.status(200).json({
            'status': 'success',
            'data': {
                'id': transaction._id
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

module.exports = {
    findAllTransactions, createTransaction, findTransactionById, updateTransaction, deleteTransaction
}