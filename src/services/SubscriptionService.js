const subscriptionRepository = require('../repositories/SubscriptionRepository');

const findAllSubscriptions = async () => {
    try {
        return await subscriptionRepository.findAllSubscriptions();
    } catch (error) {
        throw error;
    }
}

const createSubscription = async (reqBody) => {
    try {
        return await subscriptionRepository.createSubscription(reqBody);
    } catch (error) {
        throw error;
    }
}

const findSubscriptionById = async (reqParams) => {
    try {
        return await subscriptionRepository.findSubscriptionById(reqParams);
    } catch (error) {
        throw error;
    }
}

const updateSubscription = async (reqParams, reqBody) => {
    try {
        return await subscriptionRepository.updateSubscription(reqParams, reqBody);
    } catch (error) {
        throw error;
    }
}

const deleteSubscription = async (reqParams) => {
    try {
        return await subscriptionRepository.deleteSubscription(reqParams);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findAllSubscriptions, createSubscription, findSubscriptionById, updateSubscription, deleteSubscription
}