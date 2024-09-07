const subscriptionService = require('../services/SubscriptionService');
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const {sendResponse} = require("../utils/SendResponseUtil");


const findAllSubscriptions = asyncErrorHandler(async (req, resp, next) => {
    const subscriptions = await subscriptionService.findAllSubscriptions();
    await sendResponse(resp, 200, {subscriptions: subscriptions, count: subscriptions.length});
});

const findAllSubscriptionsWithPagination = asyncErrorHandler(async (req, resp, next) => {
    const subscriptionsWithPagination = await subscriptionService.findAllSubscriptionsWithPagination(req);
    await sendResponse(resp, 200, subscriptionsWithPagination);
});

const findAllSubscriptionsBySearchWithPagination = asyncErrorHandler(async (req, resp, next) => {
    const subscriptionsWithPagination = await subscriptionService.findAllSubscriptionsBySearchWithPagination(req);
    await sendResponse(resp, 200, subscriptionsWithPagination);
});

const findAllSubscriptionsWithPaginationByAuthUser = asyncErrorHandler(async (req, resp, next) => {
    const subscriptionsWithPagination = await subscriptionService.findAllSubscriptionsWithPaginationByAuthUser(req);
    await sendResponse(resp, 200, subscriptionsWithPagination);
});

const findAllSubscriptionsBySearchWithPaginationByAuthUser = asyncErrorHandler(async (req, resp, next) => {
    const subscriptionsWithPagination = await subscriptionService.findAllSubscriptionsBySearchWithPaginationByAuthUser(req);
    await sendResponse(resp, 200, subscriptionsWithPagination);
});

const getTodaySubscriptionsCollection = asyncErrorHandler(async (req, resp, next) => {
    const subscriptionsCollection = await subscriptionService.getTodaySubscriptionsCollection();
    await sendResponse(resp, 200, {subscriptionsCollection});
});

const createSubscription = asyncErrorHandler(async (req, resp, next) => {
    const subscription = await subscriptionService.createSubscription(req);
    await sendResponse(resp, 201, {subscription});
});

const findSubscriptionById = asyncErrorHandler(async (req, resp, next) => {
    const subscription = await subscriptionService.findSubscriptionById(req.params);
    await sendResponse(resp, 200, {subscription});
});

const findSubscriptionByIdWithByAuthUser = asyncErrorHandler(async (req, resp, next) => {
    const subscription = await subscriptionService.findSubscriptionByIdWithByAuthUser(req);
    await sendResponse(resp, 200, {subscription});
});

const updateSubscription = asyncErrorHandler(async (req, resp, next) => {
    const subscription = await subscriptionService.updateSubscription(req.params, req);
    await sendResponse(resp, 201, {subscription});
});

const deleteSubscription = asyncErrorHandler(async (req, resp, next) => {
    const subscription = await subscriptionService.deleteSubscription(req.params);
    await sendResponse(resp, 204, {id: subscription.id});
});

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