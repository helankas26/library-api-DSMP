const Transaction = require('../models/TransactionSchema');
const Config = require('../models/ConfigSchema');

const findAllTransactions = async () => {
    try {
        return await Transaction.find();
    } catch (error) {
        throw error;
    }
}

const createTransaction = async (req) => {
    try {
        const transactionData = req.body;

        const transaction = new Transaction({
            books: transactionData.books,
            member: transactionData.member,
            librarian: req.user.profile,
            dueAt: await (async () => {
                const config = await Config.findOne();
                return new Date(Date.now() + config.borrowableDate.count * 24 * 60 * 60 * 1000);
            })()
        });

        return await transaction.save();
    } catch (error) {
        throw error;
    }
}

const findTransactionById = async (params) => {
    try {
        return await Transaction.findById(params.id);
    } catch (error) {
        throw error;
    }
}

const updateTransaction = async (params, req) => {
    try {
        const transactionData = req.body;

        return await Transaction.findByIdAndUpdate(params.id, {
                $set: {
                    books: transactionData.books,
                    status: transactionData.status,
                    librarian: req.user.profile,
                    returnedAt: transactionData.returnedAt ? transactionData.returnedAt : undefined
                }
            }, {new: true, runValidators: true}
        );
    } catch (error) {
        throw error;
    }
}

const deleteTransaction = async (params) => {
    try {
        return await Transaction.findByIdAndDelete(params.id);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findAllTransactions, createTransaction, findTransactionById, updateTransaction, deleteTransaction
}