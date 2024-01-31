const Author = require('../models/AuthorSchema');

const findAllAuthors = async () => {
    try {
        return await Author.find();
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
        return await Author.findByIdAndDelete(params.id);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findAllAuthors, createAuthor, findAuthorById, updateAuthor, deleteAuthor
}