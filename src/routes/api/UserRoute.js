const express = require('express');

const userController = require('../../controllers/UserController');
const paramMiddleware = require('../../middlewares/ParamMiddleware');
const authMiddleware = require('../../middlewares/AuthMiddleware');
const User = require('../../models/UserSchema')

const router = express.Router();

router.param('id', async (req, res, next, value) => {
    await paramMiddleware.verifyId(req, res, next, value, User);
});

router.use(authMiddleware.verifyToken);

router.route('/').get(authMiddleware.checkPermission('ADMIN'), userController.findAllUsers);

router.route('/list')
    .get(authMiddleware.checkPermission('ADMIN'), userController.findAllUsersWithPagination);

router.route('/query')
    .get(authMiddleware.checkPermission('ADMIN'), userController.findAllUsersBySearchWithPagination);

router.route('/auth')
    .get(authMiddleware.checkPermission('ADMIN', 'USER'), userController.findUserByAuthUser)
    .patch(authMiddleware.checkPermission('ADMIN', 'USER'), userController.updateUserByAuthUser);
router.route('/auth/changePassword').patch(authMiddleware.checkPermission('ADMIN', 'USER'), userController.changePasswordByAuthUser);

router.route('/:id')
    .get(authMiddleware.checkPermission('ADMIN'), userController.findUserById)
    .patch(authMiddleware.checkPermission('ADMIN'), userController.updateUser)
    .delete(authMiddleware.checkPermission('ADMIN'), userController.deleteUser);

module.exports = router;