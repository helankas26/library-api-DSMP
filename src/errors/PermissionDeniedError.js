class PermissionDeniedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PermissionDeniedError';
        this.statusCode = 403;
        this.status = 'fail';

        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = PermissionDeniedError;