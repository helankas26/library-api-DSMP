const express = require('express');

const categoryController = require('../../controllers/CategoryController');
const paramMiddleware = require('../../middlewares/ParamMiddleware');
const Category = require('../../models/CategorySchema')

const router = express.Router();

router.param('id', async (req, res, next, value) => {
    await paramMiddleware.verifyId(req, res, next, value, Category);
});

router.route('/')
    .get(categoryController.findAllCategories)
    .post(categoryController.createCategory);

router.route('/:id')
    .get(categoryController.findCategoryById)
    .patch(categoryController.updateCategory)
    .delete(categoryController.deleteCategory);

module.exports = router;