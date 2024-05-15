const express = require('express');

const categoryController = require('../../controllers/CategoryController');
const paramMiddleware = require('../../middlewares/ParamMiddleware');
const authMiddleware = require('../../middlewares/AuthMiddleware');
const Category = require('../../models/CategorySchema');

const router = express.Router();

router.param('id', async (req, res, next, value) => {
    await paramMiddleware.verifyId(req, res, next, value, Category);
});

router.route('/')
    .get(categoryController.findAllCategories)
    .post(authMiddleware.verifyToken, authMiddleware.checkPermission('ADMIN'), categoryController.createCategory);

router.route('/:id')
    .get(authMiddleware.verifyToken, authMiddleware.checkPermission('ADMIN'), categoryController.findCategoryById)
    .patch(authMiddleware.verifyToken, authMiddleware.checkPermission('ADMIN'), categoryController.updateCategory)
    .delete(authMiddleware.verifyToken, authMiddleware.checkPermission('ADMIN'), categoryController.deleteCategory);

router.route('/:id/books')
    .get(categoryController.findAllBooksWithPaginationById);

module.exports = router;