class TooManyRequestsError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TooManyRequestsError';
        this.statusCode = 429;
        this.status = 'fail';

        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = TooManyRequestsError;