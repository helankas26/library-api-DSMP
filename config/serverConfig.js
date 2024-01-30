module.exports = {
    PORT: process.env.SERVER_PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'production',
    LOGIN_EXPIRES: process.env.LOGIN_EXPIRES || '24h',
    EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'gmail',
    EMAIL_USER: process.env.EMAIL_USER || 'helankas26@gmail.com'
};
