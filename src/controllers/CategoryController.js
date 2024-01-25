const categoryService = require('../services/CategoryService');

const findAllCategories = (req, resp) => {
    categoryService.findAllCategories().then(categories => {
        resp.status(200).json({
            'status': 'success',
            'data': {
                categories,
                count: categories.length
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}
const createCategory = (req, resp) => {
    categoryService.createCategory(req.body).then(category => {
        resp.status(201).json({
            'status': 'success',
            'data': {
                category
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

const findCategoryById = (req, resp) => {
    categoryService.findCategoryById(req.params).then(category => {
        resp.status(200).json({
            'status': 'success',
            'data': {
                category
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

const updateCategory = (req, resp) => {
    categoryService.updateCategory(req.params, req.body).then(category => {
        resp.status(201).json({
            'status': 'success',
            'data': {
                category
            }
        });
    }).catch(err => {
        return resp.status(500).json({
            'status': 'error',
            'message': err.message
        });
    });
}

const deleteCategory = (req, resp) => {
    categoryService.deleteCategory(req.params).then(category => {
        resp.status(200).json({
            'status': 'success',
            'data': {
                'id': category._id
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
    findAllCategories, createCategory, findCategoryById, updateCategory, deleteCategory
}