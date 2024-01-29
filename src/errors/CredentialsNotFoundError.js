class CredentialsNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CredentialsNotFoundError';
        this.statusCode = 400;
        this.status = 'fail';

        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = CredentialsNotFoundError;