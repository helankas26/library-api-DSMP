const Author = require('../models/AuthorSchema');
const UnprocessableError = require("../errors/UnprocessableError");

const findAllAuthors = async () => {
    try {
        return await Author.find();
    } catch (error) {
        throw error;
    }
}

const findAllAuthorsWithPagination = async (page, size) => {
    try {
        const totalCount = await Author.countDocuments();
        const totalPages = Math.ceil(totalCount / size);
        const skip = (page - 1) * size;
        const from = skip + 1;

        const authors = await Author.find({}).skip(skip).limit(size).populate({
            path: 'books',
            select: ['title', 'edition']
        });
        const to = skip + authors.length;

        return {authors, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }
}

const findAllAuthorsBySearchWithPagination = async (searchText, page, size) => {
    try {
        const totalCount = await Author.find({$text: {$search: searchText}}).countDocuments();
        const totalPages = Math.ceil(totalCount / size);
        const skip = (page - 1) * size;
        const from = skip + 1;

        const authors = await Author.find({$text: {$search: searchText}}).skip(skip).limit(size).populate({
            path: 'books',
            select: ['title', 'edition']
        });
        const to = skip + authors.length;

        return {authors, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }
}

const createAuthor = async (authorData) => {
    try {
        const author = new Author({
            name: authorData.name
        });

        return await author.save();
    } catch (error) {
        throw error;
    }
}

const findAuthorById = async (params) => {
    try {
        return await Author.findById(params.id);
    } catch (error) {
        throw error;
    }
}

const updateAuthor = async (params, authorData) => {
    try {
        return await Author.findByIdAndUpdate(params.id, authorData, {new: true, runValidators: true});
    } catch (error) {
        throw error;
    }
}

const deleteAuthor = async (params) => {
    try {
        const author = await Author.findById(params.id);

        if (author.books.length) {
            throw new UnprocessableError('Could not delete. This author associated with books!');
        }
        return await Author.findByIdAndDelete(params.id);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findAllAuthors,
    findAllAuthorsWithPagination,
    findAllAuthorsBySearchWithPagination,
    createAuthor,
    findAuthorById,
    updateAuthor,
    deleteAuthor
}