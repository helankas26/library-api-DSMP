const express = require('express');

const bookController = require('../../controllers/BookController');
const paramMiddleware = require('../../middlewares/ParamMiddleware');
const authMiddleware = require('../../middlewares/AuthMiddleware');
const Book = require('../../models/BookSchema');

const router = express.Router();

router.param('id', async (req, res, next, value) => {
    await paramMiddleware.verifyId(req, res, next, value, Book);
});

router.route('/')
    .get(authMiddleware.verifyToken, authMiddleware.checkPermission('ADMIN'), bookController.findAllBooks)
    .post(authMiddleware.verifyToken, authMiddleware.checkPermission('ADMIN'), bookController.createBook);

router.route('/list')
    .get(bookController.findAllBooksWithPagination);

router.route('/query')
    .get(bookController.findAllBooksBySearchWithPagination);

router.route('/:id')
    .get(authMiddleware.verifyToken, authMiddleware.checkPermission('ADMIN', 'USER'), bookController.findBookById)
    .patch(authMiddleware.verifyToken, authMiddleware.checkPermission('ADMIN'), bookController.updateBook)
    .delete(authMiddleware.verifyToken, authMiddleware.checkPermission('ADMIN'), bookController.deleteBook);

module.exports = router;