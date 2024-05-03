const express = require('express');

const dashboardRouteController = require('../../controllers/DashboardRouteController');
const paramMiddleware = require('../../middlewares/ParamMiddleware');
const authMiddleware = require('../../middlewares/AuthMiddleware');
const DashboardRoute = require('../../models/DashboardRouteSchema')

const router = express.Router();

router.param('id', async (req, res, next, value) => {
    await paramMiddleware.verifyId(req, res, next, value, DashboardRoute);
});

router.use(authMiddleware.verifyToken);

router.route('/')
    .get(authMiddleware.checkPermission('ADMIN'), dashboardRouteController.findAllDashboardRoutes)
    .post(authMiddleware.checkPermission('ADMIN'), dashboardRouteController.createDashboardRoute);

router.route('/auth')
    .get(authMiddleware.checkPermission('ADMIN', 'USER'), dashboardRouteController.findAllDashboardRoutesByAuthUser);

router.route('/:id')
    .get(authMiddleware.checkPermission('ADMIN'), dashboardRouteController.findDashboardRouteById)
    .patch(authMiddleware.checkPermission('ADMIN'), dashboardRouteController.updateDashboardRoute)
    .delete(authMiddleware.checkPermission('ADMIN'), dashboardRouteController.deleteDashboardRoute);


module.exports = router;