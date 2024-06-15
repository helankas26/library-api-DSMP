const {NODE_ENV} = require('../config/serverConfig');
const CastError = require("../errors/CastError");
const DuplicateKeyError = require("../errors/DuplicateKeyError");
const ValidationErrorHandler = require("../errors/ValidationErrorHandler");
const UnauthorizedAccessError = require("../errors/UnauthorizedAccessError");
const ForbiddenRequestError = require("../errors/ForbiddenRequestError");

const devErrors = (err, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stackTrace: err.stack,
        error: err
    });
}

const castErrorHandler = (err) => {
    return new CastError(`Invalid value ${err.value} for field ${err.path}!`);
}

const duplicateKeyErrorHandler = (err) => {
    return new DuplicateKeyError(`Duplicate value ${err.keyValue[Object.keys(err.keyPattern)]} for field ${Object.keys(err.keyPattern)}!`);
}

const validationErrorHandler = (err) => {
    const errors = Object.values(err.errors).map(val => val.message);
    const errorMsg = errors.join(' ');

    return new ValidationErrorHandler(`Invalid input: ${errorMsg}`);
}

const tokenExpiredErrorHandler = (err) => {
    return new ForbiddenRequestError('Token has expired!');
}

const jsonWebTokenErrorHandler = (err) => {
    return new UnauthorizedAccessError('Invalid Token. Please login again!');
}

const prodErrors = (err, res) => {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        return res.status(500).json({
            status: 'error',
            message: err.message || 'Something went wrong! Please try again later.'
        });
    }
}

const globalErrorHandler = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    if (NODE_ENV === 'development') {
        devErrors(error, res);
    } else if (NODE_ENV === 'production') {
        if (error.name === 'CastError') error = castErrorHandler(error);
        if (error.code === 11000) error = duplicateKeyErrorHandler(error);
        if (error.name === 'ValidationError') error = validationErrorHandler(error);
        if (error.name === 'TokenExpiredError') error = tokenExpiredErrorHandler(error);
        if (error.name === 'JsonWebTokenError') error = jsonWebTokenErrorHandler(error);

        prodErrors(error, res);
    }
};

module.exports = globalErrorHandler;
