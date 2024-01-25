const authorRepository = require('../repositories/AuthorRepository');

const findAllAuthors = async () => {
    try {
        return await authorRepository.findAllAuthors();
    } catch (error) {
        throw error;
    }
}

const createAuthor = async (reqBody) => {
    try {
        return await authorRepository.createAuthor(reqBody);
    } catch (error) {
        throw error;
    }
}

const findAuthorById = async (reqParams) => {
    try {
        return await authorRepository.findAuthorById(reqParams);
    } catch (error) {
        throw error;
    }
}

const updateAuthor = async (reqParams, reqBody) => {
    try {
        return await authorRepository.updateAuthor(reqParams, reqBody);
    } catch (error) {
        throw error;
    }
}

const deleteAuthor = async (reqParams) => {
    try {
        return await authorRepository.deleteAuthor(reqParams);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findAllAuthors, createAuthor, findAuthorById, updateAuthor, deleteAuthor
}