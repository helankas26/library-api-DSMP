const Book = require('../models/BookSchema');

const findAllBooks = async () => {
    try {
        return await Book.find();
    } catch (error) {
        throw error;
    }
}

const createBook = async (bookData) => {
    try {
        const book = new Book({
            title: bookData.title,
            edition: bookData.edition,
            cover: bookData.cover,
            description: bookData.description,
            noOfCopies: bookData.noOfCopies,
            availableCount: bookData.noOfCopies
        });

        return await book.save();
    } catch (error) {
        throw error;
    }
}

const findBookById = async (params) => {
    try {
        return await Book.findById(params.id);
    } catch (error) {
        throw error;
    }
}

const updateBook = async (params, bookData) => {
    try {
        return await Book.findByIdAndUpdate(params.id, bookData, {new: true});
    } catch (error) {
        throw error;
    }
}

const deleteBook = async (params) => {
    try {
        return await Book.findByIdAndDelete(params.id);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findAllBooks, createBook, findBookById, updateBook, deleteBook
}