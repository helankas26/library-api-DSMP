const authorService = require('../services/AuthorService');

const findAllAuthors = (req, resp) => {
    authorService.findAllAuthors().then(authors => {
        resp.status(200).json({
            'status': 'success',
            'data': {
                authors,
                count: authors.length
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}
const createAuthor = (req, resp) => {
    authorService.createAuthor(req.body).then(author => {
        resp.status(201).json({
            'status': 'success',
            'data': {
                author
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

const findAuthorById = (req, resp) => {
    authorService.findAuthorById(req.params).then(author => {
        resp.status(200).json({
            'status': 'success',
            'data': {
                author
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

const updateAuthor = (req, resp) => {
    authorService.updateAuthor(req.params, req.body).then(author => {
        resp.status(201).json({
            'status': 'success',
            'data': {
                author
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

const deleteAuthor = (req, resp) => {
    authorService.deleteAuthor(req.params).then(author => {
        resp.status(200).json({
            'status': 'success',
            'data': {
                'id': author._id
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

module.exports = {
    findAllAuthors, createAuthor, findAuthorById, updateAuthor, deleteAuthor
}