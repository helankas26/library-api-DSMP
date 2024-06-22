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

router.route('/list')
    .get(authMiddleware.checkPermission('ADMIN'), subscriptionController.findAllSubscriptionsWithPagination);

router.route('/query')
    .get(authMiddleware.checkPermission('ADMIN'), subscriptionController.findAllSubscriptionsBySearchWithPagination);

router.route('/auth/list')
    .get(authMiddleware.checkPermission('USER'), subscriptionController.findAllSubscriptionsWithPaginationByAuthUser);
router.route('/auth/query')
    .get(authMiddleware.checkPermission('USER'), subscriptionController.findAllSubscriptionsBySearchWithPaginationByAuthUser);

router.route('/:id')
    .get(authMiddleware.checkPermission('ADMIN'), subscriptionController.findSubscriptionById)
    .patch(authMiddleware.checkPermission('ADMIN'), subscriptionController.updateSubscription)
    .delete(authMiddleware.checkPermission('ADMIN'), subscriptionController.deleteSubscription);

router.route('/:id/auth')
    .get(authMiddleware.checkPermission('USER'), subscriptionController.findSubscriptionByIdWithByAuthUser);

module.exports = router;