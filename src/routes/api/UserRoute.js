const express = require('express');

const userController = require('../../controllers/UserController');
const paramMiddleware = require('../../middlewares/ParamMiddleware');
const authMiddleware = require('../../middlewares/AuthMiddleware');
const User = require('../../models/UserSchema')

const router = express.Router();

router.param('id', async (req, res, next, value) => {
    await paramMiddleware.verifyId(req, res, next, value, User);
});

router.route('/').get(authMiddleware.verifyToken, authMiddleware.checkPermission('ADMIN'), userController.findAllUsers)

router.route('/').patch(authMiddleware.verifyToken, userController.updateUser);
router.route('/changePassword').patch(authMiddleware.verifyToken, userController.changePassword);

router.route('/:id')
    .get(authMiddleware.verifyToken, userController.findUserById)
    .delete(authMiddleware.verifyToken, authMiddleware.checkPermission('ADMIN'), userController.deleteUser);

module.exports = router;