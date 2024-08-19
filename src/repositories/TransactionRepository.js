const mongoose = require("mongoose");

const Transaction = require('../models/TransactionSchema');
const Config = require('../models/ConfigSchema');
const Profile = require("../models/ProfileSchema");
const Book = require("../models/BookSchema");
const transactionUtils = require("../utils/TransactionUtils");
const NotFoundError = require("../errors/NotFoundError");
const ConflictError = require("../errors/ConflictError");
const ForbiddenRequestError = require("../errors/ForbiddenRequestError");

const findAllTransactions = async () => {
    try {
        return await Transaction.find();
    } catch (error) {
        throw error;
    }
}

const findAllTransactionsWithPagination = async (page, size) => {
    try {
        const totalCount = await Transaction.countDocuments();
        const totalPages = Math.ceil(totalCount / size);
        const skip = (page - 1) * size;
        const from = skip + 1;

        const transactions = await Transaction.find({}).sort({issuedAt: 'desc'}).skip(skip).limit(size)
            .populate({path: 'books', select: ['title', 'edition', 'name']})
            .populate({path: 'member', select: ['fullName']})
            .populate({path: 'librarian', select: ['fullName']});
        const to = skip + transactions.length;

        return {transactions, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }
}

const findAllTransactionsBySearchWithPagination = async (searchText, page, size) => {
    try {
        const profiles = await Profile.find({$text: {$search: searchText}}).select('_id');
        const searchedProfileIds = profiles.map(profile => profile._id);

        const books = await Book.find({$text: {$search: searchText}}).select('_id');
        const searchedBookIds = books.map(book => book._id);

        const totalCount = await Transaction.find({
            $or: [
                {$text: {$search: searchText}},
                {books: {$in: searchedBookIds}},
                {member: {$in: searchedProfileIds}},
                {librarian: {$in: searchedProfileIds}}
            ]
        }).countDocuments();
        const totalPages = Math.ceil(totalCount / size);
        const skip = (page - 1) * size;
        const from = skip + 1;

        const transactions = await Transaction.find({
            $or: [
                {$text: {$search: searchText}},
                {books: {$in: searchedBookIds}},
                {member: {$in: searchedProfileIds}},
                {librarian: {$in: searchedProfileIds}}
            ]
        }).skip(skip).limit(size)
            .populate({path: 'books', select: ['title', 'edition', 'name']})
            .populate({path: 'member', select: ['fullName']})
            .populate({path: 'librarian', select: ['fullName']});
        const to = skip + transactions.length;

        return {transactions, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }
}

const findAllTransactionsWithPaginationByAuthUser = async (req, page, size) => {
    try {
        const totalCount = await Transaction.find({member: req.user.profile}).countDocuments();
        const totalPages = Math.ceil(totalCount / size);
        const skip = (page - 1) * size;
        const from = skip + 1;

        const transactions = await Transaction.find({member: req.user.profile}).sort({issuedAt: 'desc'}).skip(skip).limit(size)
            .populate({path: 'books', select: ['title', 'edition', 'name']})
            .populate({path: 'member', select: ['fullName']})
            .populate({path: 'librarian', select: ['fullName']});
        const to = skip + transactions.length;

        return {transactions, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }
}

const findAllTransactionsBySearchWithPaginationByAuthUser = async (req, searchText, page, size) => {
    try {
        const query = {
            $or: [
                {$text: {$search: searchText}},
                {books: {$in: (await Book.find({$text: {$search: searchText}}).distinct('_id'))}},
                {librarian: {$in: (await Profile.find({$text: {$search: searchText}}).distinct('_id'))}}
            ],
            member: req.user.profile
        };
        const skip = (page - 1) * size;

        const [totalCount, transactions] = await Promise.all([
            Transaction.countDocuments(query),
            Transaction.find(query)
                .skip(skip)
                .limit(size)
                .populate({path: 'books', select: ['title', 'edition', 'name']})
                .populate({path: 'member', select: ['fullName']})
                .populate({path: 'librarian', select: ['fullName']})
        ]);

        const totalPages = Math.ceil(totalCount / size);
        const from = skip + 1;
        const to = from + transactions.length - 1;

        return {transactions, totalCount, totalPages, from, to};
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

        if (!profile) throw new NotFoundError("Member not found. Transaction unsuccessful. Try again!");
        if (!config) throw new NotFoundError("Configuration not found. Transaction unsuccessful. Try again!");
        if (!books || books.length === 0) throw new NotFoundError("Books not found. Transaction unsuccessful. Try again!");

        if (profile.borrowCount >= config.noOfBorrow.count) throw new ConflictError("Borrowable limit exceeded!");

        books.forEach((book) => {
            if (book.availableCount <= 0) throw new ConflictError(`${book.name} is not available!`);

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
        return await Transaction.findById(params.id)
            .populate({path: 'books', select: ['title', 'edition']})
            .populate({path: 'member', select: ['fullName', 'avatar']})
            .populate({path: 'librarian', select: ['fullName']});
    } catch (error) {
        throw error;
    }
}

const findTransactionByIdWithByAuthUser = async (req) => {
    try {
        const transaction = await Transaction.findOne({_id: req.params.id, member: req.user.profile})
            .populate({path: 'books', select: ['title', 'edition']})
            .populate({path: 'member', select: ['fullName', 'avatar']})
            .populate({path: 'librarian', select: ['fullName']});

        if (!transaction) throw new ForbiddenRequestError("You do not have access rights to the content!");

        return transaction;
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

        if (!transaction) throw new NotFoundError('Transaction not found');

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
        if (!tempTransaction) throw new NotFoundError("Transaction not found. Try again!");

        const [profile, books] = await Promise.all([
            Profile.findById(tempTransaction.member).session(session),
            Book.find({_id: {$in: tempTransaction.books}}).session(session)
        ]);

        if (!profile) throw new NotFoundError("Member not found. Try again!");
        if (!books || books.length === 0) throw new NotFoundError("Books not found. Try again!");

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
    findAllTransactionsWithPagination,
    findAllTransactionsBySearchWithPagination,
    findAllTransactionsWithPaginationByAuthUser,
    findAllTransactionsBySearchWithPaginationByAuthUser,
    createTransaction,
    findTransactionById,
    findTransactionByIdWithByAuthUser,
    getTransactionFineDetailsById,
    updateTransaction,
    deleteTransaction
}