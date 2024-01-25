const bookService = require('../services/BookService');

const findAllBooks = (req, resp) => {
    bookService.findAllBooks().then(books => {
        resp.status(200).json({
            'status': 'success',
            'data': {
                books,
                count: books.length
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}
const createBook = (req, resp) => {
    bookService.createBook(req.body).then(book => {
        resp.status(201).json({
            'status': 'success',
            'data': {
                book
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

const findBookById = (req, resp) => {
    bookService.findBookById(req.params).then(book => {
        resp.status(200).json({
            'status': 'success',
            'data': {
                book
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

const updateBook = (req, resp) => {
    bookService.updateBook(req.params, req.body).then(book => {
        resp.status(201).json({
            'status': 'success',
            'data': {
                book
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

const deleteBook = (req, resp) => {
    bookService.deleteBook(req.params).then(book => {
        resp.status(200).json({
            'status': 'success',
            'data': {
                'id': book._id
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
    findAllBooks, createBook, findBookById, updateBook, deleteBook
}