const mongoose = require("mongoose");

const Transaction = require('../models/TransactionSchema');
const Config = require('../models/ConfigSchema');
const Profile = require("../models/ProfileSchema");
const Book = require("../models/BookSchema");
const transactionUtils = require("../utils/TransactionUtils");

const findAllTransactions = async () => {
    try {
        return await Transaction.find();
    } catch (error) {
        throw error;
    }
}

const createTransaction = async (req) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const transactionData = req.body;

        const [profile, config, books] = await Promise.all([
            Profile.findById(transactionData.member).session(session),
            Config.findOne().session(session),
            Book.find({_id: {$in: transactionData.books}}).session(session)
        ]);

        if (!profile) throw new Error("Member not found. Transaction unsuccessful. Try again!");
        if (!config) throw new Error("Configuration not found. Transaction unsuccessful. Try again!");
        if (!books || books.length === 0) throw new Error("Books not found. Transaction unsuccessful. Try again!");

        if (profile.borrowCount >= config.noOfBorrow.count) throw new Error("Borrowable limit exceeded!");

        books.forEach((book) => {
            if (book.availableCount <= 0) throw new Error(`${book.name} is not available!`);

            book.availableCount -= 1;
        });

        const transaction = new Transaction({
            books: transactionData.books,
            member: transactionData.member,
            librarian: req.user.profile,
            dueAt: new Date(Date.now() + config.borrowableDate.count * 24 * 60 * 60 * 1000)
        });

        const savedTransaction = await transaction.save({session});
        if (!savedTransaction) throw new Error("Transaction unsuccessful. Try again!");

        profile.borrowCount += books.length;

        await Promise.all([
            profile.save({session}),
            ...books.map(book => book.save({session}))
        ]);

        await session.commitTransaction();
        return savedTransaction;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
}

const findTransactionById = async (params) => {
    try {
        return await Transaction.findById(params.id);
    } catch (error) {
        throw error;
    }
}

const getTransactionFineDetailsById = async (params) => {
    try {
        const config = await Config.findOne();
        const fineFee = config.fine.fee;

        const transaction = await Transaction.findById(params.id)
            .select(['-librarian', '-issuedAt'])
            .populate({path: 'books', select: ['title', 'edition']})
            .populate({path: 'member', select: ['fullName', 'avatar']});

        if (!transaction) throw new Error('Transaction not found');

        let totalAmount = 0;
        const books = transaction.books.map(book => {
            const fine = fineFee * transaction.noOfDate;
            totalAmount += fine;

            return {
                ...book.toJSON(),
                fine: fine
            };
        });

        return {
            ...transaction.toJSON(),
            books: books,
            totalAmount: totalAmount
        };
    } catch (error) {
        throw error;
    }
}

const updateTransaction = async (params, req) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const transactionData = req.body;
        const transaction = await transactionUtils.executeTransactionUpdate(params.id, transactionData, req.user.profile, session);

        await session.commitTransaction();
        return transaction;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
}

const deleteTransaction = async (params) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const tempTransaction = await Transaction.findById(params.id).session(session);
        if (!tempTransaction) throw new Error("Transaction not found. Try again!");

        const [profile, books] = await Promise.all([
            Profile.findById(tempTransaction.member).session(session),
            Book.find({_id: {$in: tempTransaction.books}}).session(session)
        ]);

        if (!profile) throw new Error("Member not found. Try again!");
        if (!books || books.length === 0) throw new Error("Books not found. Try again!");

        if (['BORROWED', 'OVERDUE'].includes(tempTransaction.status)) {
            books.forEach((book) => {
                book.availableCount += 1;
            });
            profile.borrowCount -= books.length;
        }

        await Promise.all([
            profile.save({session}),
            ...books.map(book => book.save({session}))
        ]);

        const transaction = await Transaction.findByIdAndDelete(params.id).session(session);

        await session.commitTransaction();
        return transaction;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
}

module.exports = {
    findAllTransactions,
    createTransaction,
    findTransactionById,
    getTransactionFineDetailsById,
    updateTransaction,
    deleteTransaction
}