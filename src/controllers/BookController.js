const bookService = require('../services/BookService');
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const {sendResponse} = require("../utils/SendResponseUtil");


const findAllBooks = asyncErrorHandler(async (req, resp, next) => {
    const books = await bookService.findAllBooks();
    await sendResponse(resp, 200, {books: books, count: books.length});
});

const findAllBooksWithPagination = asyncErrorHandler(async (req, resp, next) => {
    const booksWithPagination = await bookService.findAllBooksWithPagination(req);
    await sendResponse(resp, 200, booksWithPagination);
});

const findAllBooksBySearchWithPagination = asyncErrorHandler(async (req, resp, next) => {
    const booksWithPagination = await bookService.findAllBooksBySearchWithPagination(req);
    await sendResponse(resp, 200, booksWithPagination);
});

const createBook = asyncErrorHandler(async (req, resp, next) => {
    const book = await bookService.createBook(req.body);
    await sendResponse(resp, 201, {book});
});

const findBookById = asyncErrorHandler(async (req, resp, next) => {
    const book = await bookService.findBookById(req.params);
    await sendResponse(resp, 200, {book});
});

const updateBook = asyncErrorHandler(async (req, resp, next) => {
    const book = await bookService.updateBook(req.params, req.body);
    await sendResponse(resp, 201, {book});
});

const deleteBook = asyncErrorHandler(async (req, resp, next) => {
    const book = await bookService.deleteBook(req.params);
    await sendResponse(resp, 204, {id: book.id});
});

module.exports = {
    findAllBooks,
    findAllBooksWithPagination,
    findAllBooksBySearchWithPagination,
    createBook,
    findBookById,
    updateBook,
    deleteBook
}