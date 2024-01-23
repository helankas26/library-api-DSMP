const express = require('express');

const configController = require('../../controllers/ConfigController');
const paramMiddleware = require('../../middlewares/ParamMiddleware');
const Config = require('../../models/ConfigSchema')

const router = express.Router();

router.param('id', async (req, res, next, value) => {
    await paramMiddleware.verifyId(req, res, next, value, Config);
});

router.route('/')
    .get(configController.findAllConfigs)
    .post(configController.createConfig);

router.route('/:id')
    .get(configController.findConfigById)
    .patch(configController.updateConfig)
    .delete(configController.deleteConfig);

module.exports = router;