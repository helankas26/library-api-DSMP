const dashboardRouteRepository = require('../repositories/DashboardRouteRepository');

const findAllDashboardRoutes = async () => {
    try {
        return await dashboardRouteRepository.findAllDashboardRoutes();
    } catch (error) {
        throw error;
    }
}

const findAllDashboardRoutesByAuthUser = async (req) => {
    try {
        return await dashboardRouteRepository.findAllDashboardRoutesByAuthUser(req);
    } catch (error) {
        throw error;
    }
}

const createDashboardRoute = async (reqBody) => {
    try {
        return await dashboardRouteRepository.createDashboardRoute(reqBody);
    } catch (error) {
        throw error;
    }
}

const findDashboardRouteById = async (reqParams) => {
    try {
        return await dashboardRouteRepository.findDashboardRouteById(reqParams);
    } catch (error) {
        throw error;
    }
}

const updateDashboardRoute = async (reqParams, reqBody) => {
    try {
        return await dashboardRouteRepository.updateDashboardRoute(reqParams, reqBody);
    } catch (error) {
        throw error;
    }
}

const deleteDashboardRoute = async (reqParams) => {
    try {
        return await dashboardRouteRepository.deleteDashboardRoute(reqParams);
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