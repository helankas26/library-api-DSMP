class CastError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CastError';
        this.statusCode = 400;
        this.status = 'fail';

        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = CastError;