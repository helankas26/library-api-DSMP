class UserAlreadyExistsError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UserAlreadyExistsError';
        this.statusCode = 409;
        this.status = 'fail';

        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = UserAlreadyExistsError;