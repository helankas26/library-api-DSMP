const DashboardRoute = require('../models/DashboardRouteSchema');

const findAllDashboardRoutes = async () => {
    try {
        return await DashboardRoute.find();
    } catch (error) {
        throw error;
    }
}

const findAllDashboardRoutesByAuthUser = async (req) => {
    try {
        return await DashboardRoute.findAllByAuthUser(req.user.role);
    } catch (error) {
        throw error;
    }
}

const createDashboardRoute = async (routeData) => {
    try {
        return await DashboardRoute.create(routeData);
    } catch (error) {
        throw error;
    }
}

const findDashboardRouteById = async (params) => {
    try {
        return await DashboardRoute.findById(params.id);
    } catch (error) {
        throw error;
    }
}

const updateDashboardRoute = async (params, routeData) => {
    try {
        return await DashboardRoute.findByIdAndUpdate(params.id, routeData, {new: true});
    } catch (error) {
        throw error;
    }
}

const deleteDashboardRoute = async (params) => {
    try {
        return await DashboardRoute.findByIdAndDelete(params.id);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findAllDashboardRoutes,
    findAllDashboardRoutesByAuthUser,
    createDashboardRoute,
    findDashboardRouteById,
    updateDashboardRoute,
    deleteDashboardRoute
}