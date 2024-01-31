const express = require('express');

const subscriptionController = require('../../controllers/SubscriptionController');
const paramMiddleware = require('../../middlewares/ParamMiddleware');
const authMiddleware = require('../../middlewares/AuthMiddleware')
const Subscription = require('../../models/SubscriptionSchema')

const router = express.Router();

router.param('id', async (req, res, next, value) => {
    await paramMiddleware.verifyId(req, res, next, value, Subscription);
});

router.use(authMiddleware.verifyToken);

router.route('/')
    .get(authMiddleware.checkPermission('ADMIN'), subscriptionController.findAllSubscriptions)
    .post(authMiddleware.checkPermission('ADMIN'), subscriptionController.createSubscription);

router.route('/:id')
    .get(authMiddleware.checkPermission('ADMIN'), subscriptionController.findSubscriptionById)
    .patch(authMiddleware.checkPermission('ADMIN'), subscriptionController.updateSubscription)
    .delete(authMiddleware.checkPermission('ADMIN'), subscriptionController.deleteSubscription);

module.exports = router;