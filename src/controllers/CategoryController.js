const categoryService = require('../services/CategoryService');
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const {sendResponse} = require("../utils/SendResponseUtil");


const findAllCategories = asyncErrorHandler(async (req, resp, next) => {
    const categories = await categoryService.findAllCategories();
    await sendResponse(resp, 200, {categories: categories, count: categories.length});
});

const createCategory = asyncErrorHandler(async (req, resp, next) => {
    const category = await categoryService.createCategory(req.body);
    await sendResponse(resp, 201, {category});
});

const findCategoryById = asyncErrorHandler(async (req, resp, next) => {
    const category = await categoryService.findCategoryById(req.params)
    await sendResponse(resp, 200, {category});
});

const updateCategory = asyncErrorHandler(async (req, resp, next) => {
    const category = await categoryService.updateCategory(req.params, req.body);
    await sendResponse(resp, 201, {category});
});

const deleteCategory = asyncErrorHandler(async (req, resp, next) => {
    const category = await categoryService.deleteCategory(req.params);
    await sendResponse(resp, 204, {id: category.id});
});

module.exports = {
    findAllCategories, createCategory, findCategoryById, updateCategory, deleteCategory
}