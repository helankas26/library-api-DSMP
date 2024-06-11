class UnprocessableError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnprocessableError';
        this.statusCode = 422;
        this.status = 'fail';

        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = UnprocessableError;