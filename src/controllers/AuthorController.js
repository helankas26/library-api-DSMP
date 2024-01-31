const authorService = require('../services/AuthorService');
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const {sendResponse} = require("../utils/SendResponseUtil");


const findAllAuthors = asyncErrorHandler(async (req, resp, next) => {
    const authors = await authorService.findAllAuthors();
    await sendResponse(resp, 200, {authors: authors, count: authors.length});
});

const createAuthor = asyncErrorHandler(async (req, resp, next) => {
    const author = await authorService.createAuthor(req.body)
    await sendResponse(resp, 201, {author});
});

const findAuthorById = asyncErrorHandler(async (req, resp, next) => {
    const author = await authorService.findAuthorById(req.params);
    await sendResponse(resp, 200, {author});
});

const updateAuthor = asyncErrorHandler(async (req, resp, next) => {
    const author = await authorService.updateAuthor(req.params, req.body);
    await sendResponse(resp, 201, {author});
});

const deleteAuthor = asyncErrorHandler(async (req, resp, next) => {
    const author = await authorService.deleteAuthor(req.params);
    await sendResponse(resp, 204, {id: author.id});
});

module.exports = {
    findAllAuthors, createAuthor, findAuthorById, updateAuthor, deleteAuthor
}