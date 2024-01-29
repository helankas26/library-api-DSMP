class PasswordDoesNotMatchError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PasswordDoesNotMatchError';
        this.statusCode = 400;
        this.status = 'fail';

        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = PasswordDoesNotMatchError;