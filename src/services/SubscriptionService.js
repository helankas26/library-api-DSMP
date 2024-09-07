const subscriptionRepository = require('../repositories/SubscriptionRepository');

const findAllSubscriptions = async () => {
    try {
        return await subscriptionRepository.findAllSubscriptions();
    } catch (error) {
        throw error;
    }
}

const findAllSubscriptionsWithPagination = async (req) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 24;

    try {
        return await subscriptionRepository.findAllSubscriptionsWithPagination(page, size);
    } catch (error) {
        throw error;
    }
}

const findAllSubscriptionsBySearchWithPagination = async (req) => {
    const searchText = req.query.searchText;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 24;

    try {
        return await subscriptionRepository.findAllSubscriptionsBySearchWithPagination(searchText, page, size);
    } catch (error) {
        throw error;
    }
}

const findAllSubscriptionsWithPaginationByAuthUser = async (req) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 24;

    try {
        return await subscriptionRepository.findAllSubscriptionsWithPaginationByAuthUser(req, page, size);
    } catch (error) {
        throw error;
    }
}

const findAllSubscriptionsBySearchWithPaginationByAuthUser = async (req) => {
    const searchText = req.query.searchText;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 24;

    try {
        return await subscriptionRepository.findAllSubscriptionsBySearchWithPaginationByAuthUser(req, searchText, page, size);
    } catch (error) {
        throw error;
    }
}

const getTodaySubscriptionsCollection = async () => {
    try {
        return await subscriptionRepository.getTodaySubscriptionsCollection();
    } catch (error) {
        throw error;
    }
}

const createSubscription = async (req) => {
    try {
        return await subscriptionRepository.createSubscription(req);
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

const findSubscriptionByIdWithByAuthUser = async (req) => {
    try {
        return await subscriptionRepository.findSubscriptionByIdWithByAuthUser(req);
    } catch (error) {
        throw error;
    }
}

const updateSubscription = async (reqParams, req) => {
    try {
        return await subscriptionRepository.updateSubscription(reqParams, req);
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