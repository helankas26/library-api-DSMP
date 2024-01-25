const express = require('express');

const bookController = require('../../controllers/BookController');
const paramMiddleware = require('../../middlewares/ParamMiddleware');
const Book = require('../../models/BookSchema')

const router = express.Router();

router.param('id', async (req, res, next, value) => {
    await paramMiddleware.verifyId(req, res, next, value, Book);
});

router.route('/')
    .get(bookController.findAllBooks)
    .post(bookController.createBook);

router.route('/:id')
    .get(bookController.findBookById)
    .patch(bookController.updateBook)
    .delete(bookController.deleteBook);

module.exports = router;