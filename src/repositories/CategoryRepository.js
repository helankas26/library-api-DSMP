const Category = require('../models/CategorySchema');

const findAllCategories = async () => {
    try {
        return await Category.find();
    } catch (error) {
        throw error;
    }
}

const createCategory = async (categoryData) => {
    try {
        const category = new Category({
            categoryName: categoryData.categoryName,
            description: categoryData.description
        });

        return await category.save();
    } catch (error) {
        throw error;
    }
}

const findCategoryById = async (params) => {
    try {
        return await Category.findById(params.id);
    } catch (error) {
        throw error;
    }
}

const updateCategory = async (params, categoryData) => {
    try {
        return await Category.findByIdAndUpdate(params.id, categoryData, {new: true, runValidators: true});
    } catch (error) {
        throw error;
    }
}

const deleteCategory = async (params) => {
    try {
        return await Category.findByIdAndDelete(params.id);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findAllCategories, createCategory, findCategoryById, updateCategory, deleteCategory
}