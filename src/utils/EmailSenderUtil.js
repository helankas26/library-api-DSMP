const nodemailer = require('nodemailer');

const {EMAIL_SERVICE, EMAIL_USER} = require('../../config/serverConfig');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: EMAIL_SERVICE,
        secure: true,
        auth: {
            user: EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const emailOptions = {
        from: 'Library support<EMAIL_USER>',
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transporter.sendMail(emailOptions);
}

module.exports = {sendEmail}