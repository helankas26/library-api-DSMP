class InvalidRegistrationKeyError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidRegistrationKeyError';
        this.statusCode = 422;
        this.status = 'fail';

        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = InvalidRegistrationKeyError;