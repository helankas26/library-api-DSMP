const categoryService = require('../services/CategoryService');
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const {sendResponse} = require("../utils/SendResponseUtil");


const findAllCategories = asyncErrorHandler(async (req, resp, next) => {
    const categories = await categoryService.findAllCategories();
    await sendResponse(resp, 200, {categories: categories, count: categories.length});
});

const findAllCategoriesWithPagination = asyncErrorHandler(async (req, resp, next) => {
    const categoriesWithPagination = await categoryService.findAllCategoriesWithPagination(req);
    await sendResponse(resp, 200, categoriesWithPagination);
});

const findAllCategoriesBySearchWithPagination = asyncErrorHandler(async (req, resp, next) => {
    const categoriesWithPagination = await categoryService.findAllCategoriesBySearchWithPagination(req);
    await sendResponse(resp, 200, categoriesWithPagination);
});

const findAllBooksWithPaginationById = asyncErrorHandler(async (req, resp, next) => {
    const booksWithPaginationById = await categoryService.findAllBooksWithPaginationById(req);
    await sendResponse(resp, 200, booksWithPaginationById);
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
    findAllCategories,
    findAllCategoriesWithPagination,
    findAllCategoriesBySearchWithPagination,
    findAllBooksWithPaginationById,
    createCategory,
    findCategoryById,
    updateCategory,
    deleteCategory
}