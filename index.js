const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const sanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');

dotenv.config();

const {PORT, HOSTNAME} = require('./src/config/serverConfig');
const globalErrorHandler = require('./src/middlewares/GlobalErrorHandler');
const NotFoundError = require('./src/errors/NotFoundError');
const TooManyRequestsError = require('./src/errors/TooManyRequestsError');
const corsOptions = require('./src/config/corsOptions');
const allowCredentials = require('./src/middlewares/AccessControlAllowCredentials');
const ScheduledTasks = require('./src/utils/ScheduledTasks');

//----------------------- Routes import
const dashboardRouteRoute = require('./src/routes/api/DashboardRouteRoute');
const configRoute = require('./src/routes/api/ConfigRoute');
const authRoute = require('./src/routes/api/AuthRoute');
const profileRoute = require('./src/routes/api/ProfileRoute');
const userRoute = require('./src/routes/api/UserRoute');
const categoryRoute = require('./src/routes/api/CategoryRoute');
const authorRoute = require('./src/routes/api/AuthorRoute');
const bookRoute = require('./src/routes/api/BookRoute');
const admissionRoute = require('./src/routes/api/AdmissionRoute');
const fineRoute = require('./src/routes/api/FineRoute');
const reservationRoute = require('./src/routes/api/ReservationRoute');
const transactionRoute = require('./src/routes/api/TransactionRoute');
const subscriptionRoute = require('./src/routes/api/SubscriptionRoute');
//-----------------------

process.on('uncaughtException', (err) => {
    console.error(err.name, err.message);
    console.log('Uncaught Exception occurred! Shouting down...');

    process.exit(1);
});

const app = express();
app.use(helmet());
app.use(allowCredentials);
app.use(cors(corsOptions));

const customRateLimitHandler = (req, res, next) => {
    const err = new TooManyRequestsError('Too many requests from this IP, Please try again one hour later.');
    next(err);
};

let limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    handler: customRateLimitHandler
});

app.use('/api', limiter);

/*
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
*/
app.use(express.json({limit: '10kb'}));
app.use(cookieParser());
app.use(sanitize());
app.use(xss());
app.use(hpp());
app.use(express.urlencoded({extended: true}));


mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
})

ScheduledTasks.incrementPaymentStatus.start();
ScheduledTasks.expireReservations.start();
ScheduledTasks.overdueTransactions.start();

const server = app.listen(PORT, HOSTNAME, () => {
    console.log(`server started & running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.error(err.name, err.message);
    console.log('Unhandled Rejection occurred! Shouting down...');

    server.close(() => {
        process.exit(1);
    });
});

//----------------------- Routes
app.use('/api/v1/dashboard-routes', dashboardRouteRoute);
app.use('/api/v1/configs', configRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/profiles', profileRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/authors', authorRoute);
app.use('/api/v1/books', bookRoute);
app.use('/api/v1/admissions', admissionRoute);
app.use('/api/v1/fines', fineRoute);
app.use('/api/v1/reservations', reservationRoute);
app.use('/api/v1/transactions', transactionRoute);
app.use('/api/v1/subscriptions', subscriptionRoute);

app.all('*', (req, res, next) => {
    const err = new NotFoundError(`Can not find ${req.originalUrl} on the server`);
    next(err);
});
//-----------------------

app.use(globalErrorHandler);