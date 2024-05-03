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

router.route('/').patch(userController.updateUser);
router.route('/changePassword').patch(userController.changePassword);

router.route('/:id')
    .get(authMiddleware.checkPermission('ADMIN'), userController.findUserById)
    .delete(authMiddleware.checkPermission('ADMIN'), userController.deleteUser);

module.exports = router;