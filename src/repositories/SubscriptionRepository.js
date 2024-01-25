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

const createSubscription = async (subscriptionData) => {
    try {
        const subscription = new Subscription({
            fee: subscriptionData.fee ? subscriptionData.fee : await (async () => {
                const config = await Config.findOne();
                return config.subscription.fee;
            })(),
            paidFor: await (async () => {
                const profile = await Profile.findById(subscriptionData.member);
                const options = {month: 'long', year: 'numeric'};
                let paidFor = new Date();

                if (profile.paymentStatus > 1) {
                    paidFor = new Date(new Date().getFullYear(), new Date().getMonth() - (profile.paymentStatus - 1));
                }

                return paidFor.toLocaleString('en-US', options);
            })(),
            member: subscriptionData.member,
            librarian: subscriptionData.user.profile
        });

        return await subscription.save();
    } catch (error) {
        throw error;
    }
}

const findSubscriptionById = async (params) => {
    try {
        return await Subscription.findById(params.id);
    } catch (error) {
        throw error;
    }
}

const updateSubscription = async (params, subscriptionData) => {
    try {
        return await Subscription.findByIdAndUpdate(params.id, subscriptionData, {new: true});
    } catch (error) {
        throw error;
    }
}

const deleteSubscription = async (params) => {
    try {
        return await Subscription.findByIdAndDelete(params.id);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findAllSubscriptions, createSubscription, findSubscriptionById, updateSubscription, deleteSubscription
}