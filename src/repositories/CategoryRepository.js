const Category = require('../models/CategorySchema');
const UnprocessableError = require("../errors/UnprocessableError");

const findAllCategories = async () => {
    try {
        return await Category.find();
    } catch (error) {
        throw error;
    }
}

const findAllCategoriesWithPagination = async (page, size) => {
    try {
        const totalCount = await Category.countDocuments();
        const totalPages = Math.ceil(totalCount / size);
        const skip = (page - 1) * size;
        const from = skip + 1;

        const categories = await Category.find({}).skip(skip).limit(size).populate({
            path: 'books',
            select: ['title', 'edition']
        });
        const to = skip + categories.length;

        return {categories, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }
}

const findAllCategoriesBySearchWithPagination = async (searchText, page, size) => {
    try {
        const totalCount = await Category.find({$text: {$search: searchText}}).countDocuments();
        const totalPages = Math.ceil(totalCount / size);
        const skip = (page - 1) * size;
        const from = skip + 1;

        const categories = await Category.find({$text: {$search: searchText}}).skip(skip).limit(size).populate({
            path: 'books',
            select: ['title', 'edition']
        });
        const to = skip + categories.length;

        return {categories, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }
}

const findAllBooksWithPaginationById = async (id, page, size) => {
    try {
        const totalCount = (await Category.findById(id)).books.length;
        const totalPages = Math.ceil(totalCount / size);
        const skip = (page - 1) * size;
        const from = skip + 1;

        const {books} = await Category.findById(id).populate({
            path: 'books',
            options: {
                skip: skip,
                limit: size
            }
        });
        const to = skip + books.length;

        return {books, totalCount, totalPages, from, to};
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
        return await Category.findById(params.id).populate({
            path: 'books',
            select: ['title', 'edition']
        });
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
        const category = await Category.findById(params.id);

        if (category.books.length) {
            throw new UnprocessableError('Could not delete. This category associated with books!');
        }
        return await Category.findByIdAndDelete(params.id);
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