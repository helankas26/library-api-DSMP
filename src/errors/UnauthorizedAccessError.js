class UnauthorizedAccessError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnauthorizedAccessError';
        this.statusCode = 401;
        this.status = 'fail';

        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = UnauthorizedAccessError;