const mongoose = require("mongoose");

const Reservation = require('../models/ReservationSchema');
const Profile = require("../models/ProfileSchema");
const Book = require("../models/BookSchema");
const Config = require("../models/ConfigSchema");
const ConflictError = require("../errors/ConflictError");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenRequestError = require("../errors/ForbiddenRequestError");
const UnprocessableError = require("../errors/UnprocessableError");

const findAllReservations = async () => {
    try {
        return await Reservation.find();
    } catch (error) {
        throw error;
    }
}

const findAllReservationsWithPagination = async (page, size) => {
    try {
        const totalCount = await Reservation.countDocuments();
        const totalPages = Math.ceil(totalCount / size);
        const skip = (page - 1) * size;
        const from = skip + 1;

        const reservations = await Reservation.find({}).sort({reservationAt: 'desc'}).skip(skip).limit(size)
            .populate({path: 'book', select: ['title', 'edition']})
            .populate({path: 'member', select: ['fullName']});
        const to = skip + reservations.length;

        return {reservations, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }
}

const findAllReservationsBySearchWithPagination = async (searchText, page, size) => {
    try {
        const books = await Book.find({$text: {$search: searchText}}).select('_id');
        const searchedBookIds = books.map(book => book._id);

        const profiles = await Profile.find({$text: {$search: searchText}}).select('_id');
        const searchedProfileIds = profiles.map(profile => profile._id);

        const totalCount = await Reservation.find({
            $or: [
                {$text: {$search: searchText}},
                {book: {$in: searchedBookIds}},
                {member: {$in: searchedProfileIds}}
            ]
        }).countDocuments();
        const totalPages = Math.ceil(totalCount / size);
        const skip = (page - 1) * size;
        const from = skip + 1;

        const reservations = await Reservation.find({
            $or: [
                {$text: {$search: searchText}},
                {book: {$in: searchedBookIds}},
                {member: {$in: searchedProfileIds}}
            ]
        }).skip(skip).limit(size)
            .populate({path: 'book', select: ['title', 'edition']})
            .populate({path: 'member', select: ['fullName']});
        const to = skip + reservations.length;

        return {reservations, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }
}

const findAllReservationsWithPaginationByAuthUser = async (req, page, size) => {
    try {
        const totalCount = await Reservation.find({member: req.user.profile}).countDocuments();
        const totalPages = Math.ceil(totalCount / size);
        const skip = (page - 1) * size;
        const from = skip + 1;

        const reservations = await Reservation.find({member: req.user.profile}).sort({reservationAt: 'desc'}).skip(skip).limit(size)
            .populate({path: 'book', select: ['title', 'edition']})
            .populate({path: 'member', select: ['fullName']});
        const to = skip + reservations.length;

        return {reservations, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }
}

const findAllReservationsBySearchWithPaginationByAuthUser = async (req, searchText, page, size) => {
    try {
        const query = {
            $or: [
                {$text: {$search: searchText}},
                {book: {$in: (await Book.find({$text: {$search: searchText}}).distinct('_id'))}}
            ],
            member: req.user.profile
        };
        const skip = (page - 1) * size;

        const [totalCount, reservations] = await Promise.all([
            Reservation.countDocuments(query),
            Reservation.find(query)
                .skip(skip)
                .limit(size)
                .populate({path: 'book', select: ['title', 'edition']})
                .populate({path: 'member', select: ['fullName']})
        ]);

        const totalPages = Math.ceil(totalCount / size);
        const from = skip + 1;
        const to = from + reservations.length - 1;

        return {reservations, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }
}

const createReservation = async (req) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const reservationData = req.body;

        const [reservationExist, profile, config, book] = await Promise.all([
            Reservation.findOne({
                book: reservationData.book,
                member: req.user.profile,
                status: 'RESERVED'
            }).session(session),
            Profile.findById(req.user.profile).session(session),
            Config.findOne().session(session),
            Book.findById(reservationData.book).session(session)
        ]);

        if (reservationExist) throw new ConflictError("You have already reserved this book!");
        if (!profile) throw new NotFoundError("Profile not found. Reservation unsuccessful. Try again!");
        if (!config) throw new NotFoundError("Configuration not found. Reservation unsuccessful. Try again!");
        if (!book) throw new NotFoundError("Book not found. Reservation unsuccessful. Try again!");

        if (profile.reservationCount >= config.noOfReservation.count) {
            throw new ConflictError("Reservation limit exceeded!");
        }

        if (book.availableCount <= 0) {
            throw new ConflictError("This book is not available to reserve!");
        }

        const reservation = new Reservation({
            book: reservationData.book,
            member: req.user.profile
        });

        const savedReservation = await reservation.save({session});
        if (!savedReservation) throw new Error("Reservation unsuccessful. Try again!");

        profile.reservationCount += 1;
        book.availableCount -= 1;

        await Promise.all([
            profile.save({session}),
            book.save({session})
        ]);

        await session.commitTransaction();
        return savedReservation;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
}

const findReservationById = async (params) => {
    try {
        return await Reservation.findById(params.id)
            .populate({path: 'book', select: ['title', 'edition', 'cover']})
            .populate({path: 'member', select: ['fullName', 'avatar']});
    } catch (error) {
        throw error;
    }
}

const findReservationByIdWithByAuthUser = async (req) => {
    try {
        const reservation = await Reservation.findOne({_id: req.params.id, member: req.user.profile})
            .populate({path: 'book', select: ['title', 'edition', 'cover']})
            .populate({path: 'member', select: ['fullName', 'avatar']});

        if (!reservation) throw new ForbiddenRequestError("You do not have access rights to the content!");

        return reservation;
    } catch (error) {
        throw error;
    }
}

const updateReservation = async (params, reservationData) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const tempReservation = await Reservation.findById(params.id).session(session);
        if (!tempReservation) throw new NotFoundError("Reservation not found. Try again!");

        const [profile, book] = await Promise.all([
            Profile.findById(tempReservation.member).session(session),
            Book.findById(tempReservation.book).session(session)
        ]);

        if (!profile) throw new NotFoundError("Member not found. Try again!");
        if (!book) throw new NotFoundError("Book not found. Try again!");

        if (['CANCELLED', 'BORROWED', 'EXPIRED'].includes(reservationData.status)) {
            if (['CANCELLED', 'BORROWED', 'EXPIRED'].includes(tempReservation.status)) {
                throw new ConflictError(`Reservation is already ${tempReservation.status.toLowerCase()}!`);
            }

            profile.reservationCount -= 1;
            book.availableCount += 1;
        } else if (reservationData.status === 'RESERVED') {
            if (tempReservation.status === 'RESERVED') throw new ConflictError("Book is already reserved!");

            profile.reservationCount += 1;
            book.availableCount -= 1;
        }

        await Promise.all([
            profile.save({session}),
            book.save({session})
        ]);

        const reservation = await Reservation.findByIdAndUpdate(params.id, reservationData, {
            new: true,
            runValidators: true,
            session: session
        });

        await session.commitTransaction();
        return reservation;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
}

const updateReservationByAuthUser = async (req) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const tempReservation = await Reservation.findOne({
            _id: req.params.id,
            member: req.user.profile
        }).session(session);
        if (!tempReservation) throw new ForbiddenRequestError("You do not have access rights to update the content!");

        const [profile, book] = await Promise.all([
            Profile.findById(req.user.profile).session(session),
            Book.findById(tempReservation.book).session(session)
        ]);

        if (!profile) throw new NotFoundError("Member not found. Try again!");
        if (!book) throw new NotFoundError("Book not found. Try again!");

        if ('CANCELLED' === req.body.status) {
            if ('CANCELLED' === tempReservation.status) {
                throw new ConflictError(`Reservation is already ${tempReservation.status.toLowerCase()}!`);
            }

            profile.reservationCount -= 1;
            book.availableCount += 1;
        } else {
            throw new UnprocessableError('Unable to process the request!');
        }

        await Promise.all([
            profile.save({session}),
            book.save({session})
        ]);

        const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            session: session
        });

        await session.commitTransaction();
        return reservation;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
}

const deleteReservation = async (params) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const tempReservation = await Reservation.findById(params.id).session(session);
        if (!tempReservation) throw new NotFoundError("Reservation not found. Try again!");

        const [profile, book] = await Promise.all([
            Profile.findById(tempReservation.member).session(session),
            Book.findById(tempReservation.book).session(session)
        ]);

        if (!profile) throw new NotFoundError("Member not found. Try again!");
        if (!book) throw new NotFoundError("Book not found. Try again!");

        if (tempReservation.status === 'RESERVED') {
            profile.reservationCount -= 1;
            book.availableCount += 1;

            await Promise.all([
                profile.save({session}),
                book.save({session})
            ]);
        }

        const reservation = await Reservation.findByIdAndDelete(params.id).session(session);

        await session.commitTransaction();
        return reservation;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
}

module.exports = {
    findAllReservations,
    findAllReservationsWithPagination,
    findAllReservationsBySearchWithPagination,
    findAllReservationsWithPaginationByAuthUser,
    findAllReservationsBySearchWithPaginationByAuthUser,
    createReservation,
    findReservationById,
    findReservationByIdWithByAuthUser,
    updateReservation,
    updateReservationByAuthUser,
    deleteReservation
}