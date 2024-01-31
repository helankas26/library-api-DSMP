const configService = require('../services/ConfigService');
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const {sendResponse} = require("../utils/SendResponseUtil");


const findAllConfigs = asyncErrorHandler(async (req, resp, next) => {
    const configs = await configService.findAllConfigs();
    await sendResponse(resp, 200, {configs: configs, count: configs.length});
});

const createConfig = asyncErrorHandler(async (req, resp, next) => {
    const config = await configService.createConfig(req);
    await sendResponse(resp, 201, {config});
});

const findConfigById = asyncErrorHandler(async (req, resp, next) => {
    const config = await configService.findConfigById(req.params);
    await sendResponse(resp, 200, {config});
});

const updateConfig = asyncErrorHandler(async (req, resp, next) => {
    const config = await configService.updateConfig(req.params, req);
    await sendResponse(resp, 201, {config});
});

const deleteConfig = asyncErrorHandler(async (req, resp, next) => {
    const config = await configService.deleteConfig(req.params);
    await sendResponse(resp, 204, {id: config.id});
});

module.exports = {
    findAllConfigs, createConfig, findConfigById, updateConfig, deleteConfig
}