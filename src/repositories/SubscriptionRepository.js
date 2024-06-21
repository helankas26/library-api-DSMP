const mongoose = require('mongoose');

const Subscription = require('../models/SubscriptionSchema');
const Config = require("../models/ConfigSchema");
const Profile = require("../models/ProfileSchema");

const findAllSubscriptions = async () => {
    try {
        return await Subscription.find();
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
                throw new Error("Profile not found. Payment unsuccessful. Try again!");
            }

            if (profile.paymentStatus > 0) {
                profile.paymentStatus -= 1;
                await profile.save({session: session});
            } else {
                throw new Error("Payment unsuccessful. Could not pay for up coming month!");
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
        return await Subscription.findById(params.id);
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
            throw new Error("Payment not found. Try again!");
        }

        const profile = await Profile.findById(payment.member).session(session);
        if (!payment) {
            throw new Error("Member not found. Try again!");
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
    findAllSubscriptions, createSubscription, findSubscriptionById, updateSubscription, deleteSubscription
}