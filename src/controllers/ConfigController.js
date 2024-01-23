const configService = require('../services/ConfigService');

const findAllConfigs = (req, resp) => {
    configService.findAllConfigs().then(configs => {
        resp.status(200).json({
            'status': 'success',
            'data': {
                configs,
                count: configs.length
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

const createConfig = (req, resp) => {
    configService.createConfig(req.body).then(config => {
        resp.status(201).json({
            'status': 'success',
            'data': {
                config
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

const findConfigById = (req, resp) => {
    configService.findConfigById(req.params).then(config => {
        resp.status(200).json({
            'status': 'success',
            'data': {
                config
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

const updateConfig = (req, resp) => {
    configService.updateConfig(req.params, req.body).then(config => {
        resp.status(201).json({
            'status': 'success',
            'data': {
                config
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

const deleteConfig = (req, resp) => {
    configService.deleteConfig(req.params).then(config => {
        resp.status(200).json({
            'status': 'success',
            'data': {
                'id': config._id
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
    findAllConfigs, createConfig, findConfigById, updateConfig, deleteConfig
}