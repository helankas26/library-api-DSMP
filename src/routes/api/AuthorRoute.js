const express = require('express');

const authorController = require('../../controllers/AuthorController');
const paramMiddleware = require('../../middlewares/ParamMiddleware');
const Author = require('../../models/AuthorSchema')

const router = express.Router();

router.param('id', async (req, res, next, value) => {
    await paramMiddleware.verifyId(req, res, next, value, Author);
});

router.route('/')
    .get(authorController.findAllAuthors)
    .post(authorController.createAuthor);

router.route('/:id')
    .get(authorController.findAuthorById)
    .patch(authorController.updateAuthor)
    .delete(authorController.deleteAuthor);

module.exports = router;