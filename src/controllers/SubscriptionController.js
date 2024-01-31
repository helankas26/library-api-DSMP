const subscriptionService = require('../services/SubscriptionService');
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const {sendResponse} = require("../utils/SendResponseUtil");


const findAllSubscriptions = asyncErrorHandler(async (req, resp, next) => {
    const subscriptions = await subscriptionService.findAllSubscriptions();
    await sendResponse(resp, 200, {subscriptions: subscriptions, count: subscriptions.length});
});

const createSubscription = asyncErrorHandler(async (req, resp, next) => {
    const subscription = await subscriptionService.createSubscription(req);
    await sendResponse(resp, 201, {subscription});
});

const findSubscriptionById = asyncErrorHandler(async (req, resp, next) => {
    const subscription = await subscriptionService.findSubscriptionById(req.params);
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
    findAllSubscriptions, createSubscription, findSubscriptionById, updateSubscription, deleteSubscription
}