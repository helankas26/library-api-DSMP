const dashboardRouteService = require('../services/DashboardRouteService');
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const {sendResponse} = require("../utils/SendResponseUtil");


const findAllDashboardRoutes = asyncErrorHandler(async (req, resp, next) => {
    const dashboardRoutes = await dashboardRouteService.findAllDashboardRoutes();
    await sendResponse(resp, 200, {dashboardRoutes: dashboardRoutes, count: dashboardRoutes.length});
});

const findAllDashboardRoutesByAuthUser = asyncErrorHandler(async (req, resp, next) => {
    const dashboardRoutes = await dashboardRouteService.findAllDashboardRoutesByAuthUser(req);
    await sendResponse(resp, 200, {dashboardRoutes: dashboardRoutes, count: dashboardRoutes.length});
});

const createDashboardRoute = asyncErrorHandler(async (req, resp, next) => {
    const dashboardRoute = await dashboardRouteService.createDashboardRoute(req.body)
    await sendResponse(resp, 201, {dashboardRoute});
});

const findDashboardRouteById = asyncErrorHandler(async (req, resp, next) => {
    const dashboardRoute = await dashboardRouteService.findDashboardRouteById(req.params);
    await sendResponse(resp, 200, {dashboardRoute});
});

const updateDashboardRoute = asyncErrorHandler(async (req, resp, next) => {
    const dashboardRoute = await dashboardRouteService.updateDashboardRoute(req.params, req.body);
    await sendResponse(resp, 201, {dashboardRoute});
});

const deleteDashboardRoute = asyncErrorHandler(async (req, resp, next) => {
    const dashboardRoute = await dashboardRouteService.deleteDashboardRoute(req.params);
    await sendResponse(resp, 204, {id: dashboardRoute.id});
});

module.exports = {
    findAllDashboardRoutes,
    findAllDashboardRoutesByAuthUser,
    createDashboardRoute,
    findDashboardRouteById,
    updateDashboardRoute,
    deleteDashboardRoute
}