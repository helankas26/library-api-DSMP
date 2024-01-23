const configRepository = require('../repositories/ConfigRepository');

const findAllConfigs = async () => {
    try {
        return await configRepository.findAllConfigs();
    } catch (error) {
        throw error;
    }
}

const createConfig = async (reqBody) => {
    try {
        return await configRepository.createConfig(reqBody);
    } catch (error) {
        throw error;
    }
}

const findConfigById = async (reqParams) => {
    try {
        return await configRepository.findConfigById(reqParams);
    } catch (error) {
        throw error;
    }
}

const updateConfig = async (reqParams, reqBody) => {
    try {
        return await configRepository.updateConfig(reqParams, reqBody);
    } catch (error) {
        throw error;
    }
}

const deleteConfig = async (reqParams) => {
    try {
        return await configRepository.deleteConfig(reqParams);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findAllConfigs, createConfig, findConfigById, updateConfig, deleteConfig
}