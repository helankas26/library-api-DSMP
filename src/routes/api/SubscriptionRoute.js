const express = require('express');

const subscriptionController = require('../../controllers/SubscriptionController');
const paramMiddleware = require('../../middlewares/ParamMiddleware');
const Subscription = require('../../models/SubscriptionSchema')

const router = express.Router();

router.param('id', async (req, res, next, value) => {
    await paramMiddleware.verifyId(req, res, next, value, Subscription);
});

router.route('/')
    .get(subscriptionController.findAllSubscriptions)
    .post(subscriptionController.createSubscription);

router.route('/:id')
    .get(subscriptionController.findSubscriptionById)
    .patch(subscriptionController.updateSubscription)
    .delete(subscriptionController.deleteSubscription);

module.exports = router;