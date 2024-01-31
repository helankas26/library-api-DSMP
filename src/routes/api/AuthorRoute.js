const express = require('express');

const authorController = require('../../controllers/AuthorController');
const paramMiddleware = require('../../middlewares/ParamMiddleware');
const authMiddleware = require('../../middlewares/AuthMiddleware');
const Author = require('../../models/AuthorSchema')

const router = express.Router();

router.param('id', async (req, res, next, value) => {
    await paramMiddleware.verifyId(req, res, next, value, Author);
});

router.route('/')
    .get(authorController.findAllAuthors)
    .post(authMiddleware.verifyToken, authMiddleware.checkPermission('ADMIN'), authorController.createAuthor);

router.route('/:id')
    .get(authMiddleware.verifyToken, authMiddleware.checkPermission('ADMIN'), authorController.findAuthorById)
    .patch(authMiddleware.verifyToken, authMiddleware.checkPermission('ADMIN'), authorController.updateAuthor)
    .delete(authMiddleware.verifyToken, authMiddleware.checkPermission('ADMIN'), authorController.deleteAuthor);

module.exports = router;