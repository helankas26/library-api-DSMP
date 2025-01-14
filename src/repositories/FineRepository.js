const mongoose = require("mongoose");

const Fine = require('../models/FineSchema');
const Profile = require('../models/ProfileSchema');
const Book = require('../models/BookSchema');
const transactionUtils = require("../utils/TransactionUtils");
const ForbiddenRequestError = require("../errors/ForbiddenRequestError");

const findAllFines = async () => {
    try {
        return await Fine.find();
    } catch (error) {
        throw error;
    }
}

const findAllFinesWithPagination = async (page, size) => {
    try {
        const totalCount = await Fine.countDocuments();
        const totalPages = Math.ceil(totalCount / size);
        const skip = (page - 1) * size;
        const from = skip + 1;

        const fines = await Fine.find({}).sort({createdAt: 'desc'}).skip(skip).limit(size)
            .populate({path: 'member', select: ['fullName']})
            .populate({path: 'book', select: ['title', 'edition']})
            .populate({path: 'librarian', select: ['fullName']});
        const to = skip + fines.length;

        return {fines, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }
}

const findAllFinesBySearchWithPagination = async (searchText, page, size) => {
    try {
        const profiles = await Profile.find({$text: {$search: searchText}}).select('_id');
        const searchedProfileIds = profiles.map(profile => profile._id);

        const books = await Book.find({$text: {$search: searchText}}).select('_id');
        const searchedBookIds = books.map(book => book._id);

        const totalCount = await Fine.find({
            $or: [
                {$text: {$search: searchText}},
                {member: {$in: searchedProfileIds}},
                {book: {$in: searchedBookIds}},
                {librarian: {$in: searchedProfileIds}}
            ]
        }).countDocuments();
        const totalPages = Math.ceil(totalCount / size);
        const skip = (page - 1) * size;
        const from = skip + 1;

        const fines = await Fine.find({
            $or: [
                {$text: {$search: searchText}},
                {member: {$in: searchedProfileIds}},
                {book: {$in: searchedBookIds}},
                {librarian: {$in: searchedProfileIds}}
            ]
        }).skip(skip).limit(size)
            .populate({path: 'member', select: ['fullName']})
            .populate({path: 'book', select: ['title', 'edition']})
            .populate({path: 'librarian', select: ['fullName']});
        const to = skip + fines.length;

        return {fines, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }
}

const findAllFinesWithPaginationByAuthUser = async (req, page, size) => {
    try {
        const totalCount = await Fine.find({member: req.user.profile}).countDocuments();
        const totalPages = Math.ceil(totalCount / size);
        const skip = (page - 1) * size;
        const from = skip + 1;

        const fines = await Fine.find({member: req.user.profile}).sort({createdAt: 'desc'}).skip(skip).limit(size)
            .populate({path: 'member', select: ['fullName']})
            .populate({path: 'book', select: ['title', 'edition']})
            .populate({path: 'librarian', select: ['fullName']});
        const to = skip + fines.length;

        return {fines, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }
}

const findAllFinesBySearchWithPaginationByAuthUser = async (req, searchText, page, size) => {
    try {
        const query = {
            $or: [
                {$text: {$search: searchText}},
                {book: {$in: (await Book.find({$text: {$search: searchText}}).distinct('_id'))}},
                {librarian: {$in: (await Profile.find({$text: {$search: searchText}}).distinct('_id'))}}
            ],
            member: req.user.profile
        };
        const skip = (page - 1) * size;

        const [totalCount, fines] = await Promise.all([
            Fine.countDocuments(query),
            Fine.find(query)
                .skip(skip)
                .limit(size)
                .populate({path: 'member', select: ['fullName']})
                .populate({path: 'book', select: ['title', 'edition']})
                .populate({path: 'librarian', select: ['fullName']})
        ]);

        const totalPages = Math.ceil(totalCount / size);
        const from = skip + 1;
        const to = from + fines.length - 1;

        return {fines, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }
}

const getTodayFinesCollection = async (req, searchText, page, size) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    try {
        const fines = await Fine.find({
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        return fines.reduce((sum, fine) => sum + fine.fee, 0);
    } catch (error) {
        throw error;
    }
}

const createFine = async (req) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const {fines, transactionId} = req.body;
        const finesData = fines.map((fine) => {
            return {...fine, librarian: req.user.profile}
        });

        await transactionUtils.executeTransactionUpdate(transactionId, {status: 'RETURNED'}, req.user.profile, session);
        const fine = await Fine.create(finesData, {session: session});

        await session.commitTransaction();
        return fine;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
}

const findFineById = async (params) => {
    try {
        return await Fine.findById(params.id)
            .populate({path: 'member', select: ['fullName', 'avatar']})
            .populate({path: 'book', select: ['title', 'edition', 'cover']})
            .populate({path: 'librarian', select: ['fullName']});
    } catch (error) {
        throw error;
    }
}

const findFineByIdWithByAuthUser = async (req) => {
    try {
        const fine = await Fine.findOne({_id: req.params.id, member: req.user.profile})
            .populate({path: 'member', select: ['fullName', 'avatar']})
            .populate({path: 'book', select: ['title', 'edition', 'cover']})
            .populate({path: 'librarian', select: ['fullName']});

        if (!fine) throw new ForbiddenRequestError("You do not have access rights to the content!");

        return fine;
    } catch (error) {
        throw error;
    }
}

const updateFine = async (params, req) => {
    try {
        const fineData = req.body;

        return await Fine.findByIdAndUpdate(params.id, {
                $set: {
                    fee: fineData.fee,
                    librarian: req.user.profile
                }
            }, {new: true, runValidators: true}
        );
    } catch (error) {
        throw error;
    }
}

const deleteFine = async (params) => {
    try {
        return await Fine.findByIdAndDelete(params.id);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findAllFines,
    findAllFinesWithPagination,
    findAllFinesBySearchWithPagination,
    findAllFinesWithPaginationByAuthUser,
    findAllFinesBySearchWithPaginationByAuthUser,
    getTodayFinesCollection,
    createFine,
    findFineById,
    findFineByIdWithByAuthUser,
    updateFine,
    deleteFine
}