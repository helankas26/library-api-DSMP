const categoryRepository = require('../repositories/CategoryRepository');

const findAllCategories = async () => {
    try {
        return await categoryRepository.findAllCategories();
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
    findAllCategories, createCategory, findCategoryById, updateCategory, deleteCategory
}