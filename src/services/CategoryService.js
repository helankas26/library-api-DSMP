const categoryRepository = require('../repositories/CategoryRepository');

const findAllCategories = async () => {
    try {
        return await categoryRepository.findAllCategories();
    } catch (error) {
        throw error;
    }
}

const findAllCategoriesWithPagination = async (req) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 24;

    try {
        return await categoryRepository.findAllCategoriesWithPagination(page, size);
    } catch (error) {
        throw error;
    }
}

const findAllCategoriesBySearchWithPagination = async (req) => {
    const searchText = req.query.searchText;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 24;

    try {
        return await categoryRepository.findAllCategoriesBySearchWithPagination(searchText, page, size);
    } catch (error) {
        throw error;
    }
}

const findAllBooksWithPaginationById = async (req) => {
    const id = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 12;

    try {
        return await categoryRepository.findAllBooksWithPaginationById(id, page, size);
    } catch (error) {
        throw error;
    }
}

const createCategory = async (reqBody) => {
    try {
        return await categoryRepository.createCategory(reqBody);
    } catch (error) {
        throw error;
    }
}

const findCategoryById = async (reqParams) => {
    try {
        return await categoryRepository.findCategoryById(reqParams);
    } catch (error) {
        throw error;
    }
}

const updateCategory = async (reqParams, reqBody) => {
    try {
        return await categoryRepository.updateCategory(reqParams, reqBody);
    } catch (error) {
        throw error;
    }
}

const deleteCategory = async (reqParams) => {
    try {
        return await categoryRepository.deleteCategory(reqParams);
    } catch (error) {
        throw error;
    }
}

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