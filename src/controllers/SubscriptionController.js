const subscriptionService = require('../services/SubscriptionService');

const findAllSubscriptions = (req, resp) => {
    subscriptionService.findAllSubscriptions().then(subscriptions => {
        resp.status(200).json({
            'status': 'success',
            'data': {
                subscriptions,
                count: subscriptions.length
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}
const createSubscription = (req, resp) => {
    subscriptionService.createSubscription(req.body).then(subscription => {
        resp.status(201).json({
            'status': 'success',
            'data': {
                subscription
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

const findSubscriptionById = (req, resp) => {
    subscriptionService.findSubscriptionById(req.params).then(subscription => {
        resp.status(200).json({
            'status': 'success',
            'data': {
                subscription
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

const updateSubscription = (req, resp) => {
    subscriptionService.updateSubscription(req.params, req.body).then(subscription => {
        resp.status(201).json({
            'status': 'success',
            'data': {
                subscription
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

const deleteSubscription = (req, resp) => {
    subscriptionService.deleteSubscription(req.params).then(subscription => {
        resp.status(200).json({
            'status': 'success',
            'data': {
                'id': subscription._id
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

module.exports = {
    findAllSubscriptions, createSubscription, findSubscriptionById, updateSubscription, deleteSubscription
}