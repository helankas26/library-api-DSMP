module.exports = {
    PORT: process.env.SERVER_PORT || 3000,
    HOSTNAME: process.env.SERVER_HOSTNAME || 'localhost',
    NODE_ENV: process.env.NODE_ENV || 'production',
    ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES || 86400000,
    REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES || 432000000,
    EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'gmail',
    EMAIL_USER: process.env.EMAIL_USER || 'helankas26@gmail.com'
};
