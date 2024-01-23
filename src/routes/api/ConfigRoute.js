const express = require('express');

const configController = require('../../controllers/ConfigController');

const router = express.Router();

router.route('/')
    .get(configController.findAllConfigs)
    .post(configController.createConfig);

router.route('/:id')
    .get(configController.findConfigById)
    .patch(configController.updateConfig)
    .delete(configController.deleteConfig);

module.exports = router;