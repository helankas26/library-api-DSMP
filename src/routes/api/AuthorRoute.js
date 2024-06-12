const express = require('express');

const authorController = require('../../controllers/AuthorController');
const paramMiddleware = require('../../middlewares/ParamMiddleware');
const authMiddleware = require('../../middlewares/AuthMiddleware');
const Author = require('../../models/AuthorSchema')

const router = express.Router();

router.param('id', async (req, res, next, value) => {
    await paramMiddleware.verifyId(req, res, next, value, Author);
});

router.use(authMiddleware.verifyToken);

router.route('/')
    .get(authMiddleware.checkPermission('ADMIN'), authorController.findAllAuthors)
    .post(authMiddleware.checkPermission('ADMIN'), authorController.createAuthor);

router.route('/list')
    .get(authMiddleware.checkPermission('ADMIN'), authorController.findAllAuthorsWithPagination);

router.route('/query')
    .get(authMiddleware.checkPermission('ADMIN'), authorController.findAllAuthorsBySearchWithPagination);

router.route('/:id')
    .get(authMiddleware.checkPermission('ADMIN'), authorController.findAuthorById)
    .patch(authMiddleware.checkPermission('ADMIN'), authorController.updateAuthor)
    .delete(authMiddleware.checkPermission('ADMIN'), authorController.deleteAuthor);

module.exports = router;