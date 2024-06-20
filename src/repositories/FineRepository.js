const Fine = require('../models/FineSchema');
const Profile = require('../models/ProfileSchema');
const Book = require('../models/BookSchema');

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

        const fines = await Fine.find({}).skip(skip).limit(size)
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
    return "not implemented"
    /*try {
        const totalCount = await Fine.countDocuments();
        const totalPages = Math.ceil(totalCount / size);
        const skip = (page - 1) * size;
        const from = skip + 1;

        const fines = await Fine.find({}).skip(skip).limit(size)
            .populate({path: 'member', select: ['fullName', 'avatar']})
            .populate({path: 'librarian', select: ['fullName']});
        const to = skip + fines.length;

        return {fines, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }*/
}

const findAllFinesBySearchWithPaginationByAuthUser = async (req, searchText, page, size) => {
    return "not implemented"
    /*try {
        const profiles = await Profile.find({$text: {$search: searchText}}).select('_id');
        const searchedProfileIds = profiles.map(profile => profile._id);

        const books = await Book.find({$text: {$search: searchText}}).select('_id');
        const searchedBookIds = books.map(book => book._id);

        const totalCount = await Fine.find({
            $or: [
                {$text: {$search: searchText}},
                {member: {$in: searchedProfileIds}},
                {librarian: {$in: searchedProfileIds}}
            ]
        }).countDocuments();
        const totalPages = Math.ceil(totalCount / size);
        const skip = (page - 1) * size;
        const from = skip + 1;

        const admissions = await Fine.find({
            $or: [
                {$text: {$search: searchText}},
                {member: {$in: searchedProfileIds}},
                {librarian: {$in: searchedProfileIds}}
            ]
        }).skip(skip).limit(size)
            .populate({path: 'member', select: ['fullName', 'avatar']})
            .populate({path: 'librarian', select: ['fullName']});
        const to = skip + admissions.length;

        return {admissions, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }*/
}

const createFine = async (req) => {
    try {
        const fineData = req.body;

        const fine = new Fine({
            fee: fineData.fee,
            member: fineData.member,
            book: fineData.book,
            noOfDate: fineData.noOfDate,
            librarian: req.user.profile
        });

        return await fine.save();
    } catch (error) {
        throw error;
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
        return await Fine.findOne({_id: req.params.id, member: req.user.profile})
            .populate({path: 'member', select: ['fullName', 'avatar']})
            .populate({path: 'book', select: ['title', 'edition', 'cover']})
            .populate({path: 'librarian', select: ['fullName']});
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
    createFine,
    findFineById,
    findFineByIdWithByAuthUser,
    updateFine,
    deleteFine
}