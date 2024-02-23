const express = require('express');

const authController = require('../../controllers/AuthController');
const authMiddleware = require('../../middlewares/AuthMiddleware');

const router = express.Router();

router.route('/refresh').get(authController.refreshToken);

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/logout').post(authMiddleware.verifyToken, authController.logout);
router.route('/forgetPassword').post(authController.forgetPassword);

router.route('/resetPassword').patch(authController.resetPassword);

module.exports = router;