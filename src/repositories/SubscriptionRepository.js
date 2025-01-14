const mongoose = require('mongoose');

const Subscription = require('../models/SubscriptionSchema');
const Config = require("../models/ConfigSchema");
const Profile = require("../models/ProfileSchema");
const ConflictError = require("../errors/ConflictError");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenRequestError = require("../errors/ForbiddenRequestError");

const findAllSubscriptions = async () => {
    try {
        return await Subscription.find();
    } catch (error) {
        throw error;
    }
}

const findAllSubscriptionsWithPagination = async (page, size) => {
    try {
        const totalCount = await Subscription.countDocuments();
        const totalPages = Math.ceil(totalCount / size);
        const skip = (page - 1) * size;
        const from = skip + 1;

        const subscriptions = await Subscription.find({}).sort({paidAt: 'desc'}).skip(skip).limit(size)
            .populate({path: 'member', select: ['fullName']})
            .populate({path: 'librarian', select: ['fullName']});
        const to = skip + subscriptions.length;

        return {subscriptions, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }
}

const findAllSubscriptionsBySearchWithPagination = async (searchText, page, size) => {
    try {
        const profiles = await Profile.find({$text: {$search: searchText}}).select('_id');
        const searchedProfileIds = profiles.map(profile => profile._id);

        const totalCount = await Subscription.find({
            $or: [
                {$text: {$search: searchText}},
                {member: {$in: searchedProfileIds}},
                {librarian: {$in: searchedProfileIds}}
            ]
        }).countDocuments();
        const totalPages = Math.ceil(totalCount / size);
        const skip = (page - 1) * size;
        const from = skip + 1;

        const subscriptions = await Subscription.find({
            $or: [
                {$text: {$search: searchText}},
                {member: {$in: searchedProfileIds}},
                {librarian: {$in: searchedProfileIds}}
            ]
        }).skip(skip).limit(size)
            .populate({path: 'member', select: ['fullName']})
            .populate({path: 'librarian', select: ['fullName']});
        const to = skip + subscriptions.length;

        return {subscriptions, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }
}

const findAllSubscriptionsWithPaginationByAuthUser = async (req, page, size) => {
    try {
        const totalCount = await Subscription.find({member: req.user.profile}).countDocuments();
        const totalPages = Math.ceil(totalCount / size);
        const skip = (page - 1) * size;
        const from = skip + 1;

        const subscriptions = await Subscription.find({member: req.user.profile}).sort({paidAt: 'desc'}).skip(skip).limit(size)
            .populate({path: 'member', select: ['fullName']})
            .populate({path: 'librarian', select: ['fullName']});
        const to = skip + subscriptions.length;

        return {subscriptions, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }
}

const findAllSubscriptionsBySearchWithPaginationByAuthUser = async (req, searchText, page, size) => {
    try {
        const query = {
            $or: [
                {$text: {$search: searchText}},
                {librarian: {$in: (await Profile.find({$text: {$search: searchText}}).distinct('_id'))}}
            ],
            member: req.user.profile
        };
        const skip = (page - 1) * size;

        const [totalCount, subscriptions] = await Promise.all([
            Subscription.countDocuments(query),
            Subscription.find(query)
                .skip(skip)
                .limit(size)
                .populate({path: 'member', select: ['fullName']})
                .populate({path: 'librarian', select: ['fullName']})
        ]);

        const totalPages = Math.ceil(totalCount / size);
        const from = skip + 1;
        const to = from + subscriptions.length - 1;

        return {subscriptions, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }
}

const getTodaySubscriptionsCollection = async (req, searchText, page, size) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    try {
        const subscriptions = await Subscription.find({
            paidAt: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        return subscriptions.reduce((sum, subscription) => sum + subscription.fee, 0);
    } catch (error) {
        throw error;
    }
}

const createSubscription = async (req) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const subscriptionData = req.body;

        const subscription = new Subscription({
            fee: subscriptionData.fee ? subscriptionData.fee : await (async () => {
                const config = await Config.findOne().session(session);
                return config.subscription.fee;
            })(),
            paidFor: await (async () => {
                const profile = await Profile.findById(subscriptionData.member).session(session);
                const options = {month: 'long', year: 'numeric'};
                let paidFor = new Date();

                if (profile.paymentStatus > 1) {
                    paidFor = new Date(new Date().getFullYear(), new Date().getMonth() - (profile.paymentStatus - 1));
                }

                return paidFor.toLocaleString('en-US', options);
            })(),
            member: subscriptionData.member,
            librarian: req.user.profile
        });

        const savedSubscription = await subscription.save({session: session});
        if (!savedSubscription) {
            throw new Error("Payment unsuccessful. Try again!");
        }

        try {
            const profile = await Profile.findById(subscriptionData.member).session(session);
            if (!profile) {
                throw new ConflictError("Profile not found. Payment unsuccessful. Try again!");
            }

            if (profile.paymentStatus > 0) {
                profile.paymentStatus -= 1;
                await profile.save({session: session});
            } else {
                throw new ConflictError("Payment unsuccessful. Could not pay for up coming month!");
            }
        } catch (error) {
            throw error;
        }

        await session.commitTransaction();
        return savedSubscription;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
}

const findSubscriptionById = async (params) => {
    try {
        return await Subscription.findById(params.id)
            .populate({path: 'member', select: ['fullName', 'avatar']})
            .populate({path: 'librarian', select: ['fullName']});
    } catch (error) {
        throw error;
    }
}

const findSubscriptionByIdWithByAuthUser = async (req) => {
    try {
        const subscription = await Subscription.findOne({_id: req.params.id, member: req.user.profile})
            .populate({path: 'member', select: ['fullName', 'avatar']})
            .populate({path: 'librarian', select: ['fullName']});

        if (!subscription) throw new ForbiddenRequestError("You do not have access rights to the content!");

        return subscription;
    } catch (error) {
        throw error;
    }
}

const updateSubscription = async (params, req) => {
    try {
        const subscriptionData = req.body;

        return await Subscription.findByIdAndUpdate(params.id, {
                $set: {
                    fee: subscriptionData.fee,
                    paidFor: subscriptionData.paidFor,
                    librarian: req.user.profile,
                    updateAt: Date.now()
                }
            }, {new: true, runValidators: true}
        );
    } catch (error) {
        throw error;
    }
}

const deleteSubscription = async (params) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const payment = await Subscription.findById(params.id).session(session);
        if (!payment) {
            throw new NotFoundError("Payment not found. Try again!");
        }

        const profile = await Profile.findById(payment.member).session(session);
        if (!profile) {
            throw new NotFoundError("Member not found. Try again!");
        }

        profile.paymentStatus += 1;
        await profile.save({session: session});
        const subscription = await Subscription.findByIdAndDelete(params.id).session(session);

        await session.commitTransaction();
        return subscription;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
}

module.exports = {
    findAllSubscriptions,
    findAllSubscriptionsWithPagination,
    findAllSubscriptionsBySearchWithPagination,
    findAllSubscriptionsWithPaginationByAuthUser,
    findAllSubscriptionsBySearchWithPaginationByAuthUser,
    getTodaySubscriptionsCollection,
    createSubscription,
    findSubscriptionById,
    findSubscriptionByIdWithByAuthUser,
    updateSubscription,
    deleteSubscription
}