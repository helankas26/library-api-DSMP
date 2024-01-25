const bookRepository = require('../repositories/BookRepository');

const findAllBooks = async () => {
    try {
        return await bookRepository.findAllBooks();
    } catch (error) {
        throw error;
    }
}

const createBook = async (reqBody) => {
    try {
        return await bookRepository.createBook(reqBody);
    } catch (error) {
        throw error;
    }
}

const findBookById = async (reqParams) => {
    try {
        return await bookRepository.findBookById(reqParams);
    } catch (error) {
        throw error;
    }
}

const updateBook = async (reqParams, reqBody) => {
    try {
        return await bookRepository.updateBook(reqParams, reqBody);
    } catch (error) {
        throw error;
    }
}

const deleteBook = async (reqParams) => {
    try {
        return await bookRepository.deleteBook(reqParams);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findAllBooks, createBook, findBookById, updateBook, deleteBook
}