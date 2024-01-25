const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const bodyParser = require('body-parser');

dotenv.config();

const {PORT} = require('./config/serverConfig');

//----------------------- Routes import
const configRoute = require('./src/routes/api/ConfigRoute');
const profileRoute = require('./src/routes/api/ProfileRoute');
const categoryRoute = require('./src/routes/api/CategoryRoute');
const authorRoute = require('./src/routes/api/AuthorRoute');
const bookRoute = require('./src/routes/api/BookRoute');
const admissionRoute = require('./src/routes/api/AdmissionRoute');
const fineRoute = require('./src/routes/api/FineRoute');
const reservationRoute = require('./src/routes/api/ReservationRoute');
const transactionRoute = require('./src/routes/api/TransactionRoute');
const subscriptionRoute = require('./src/routes/api/SubscriptionRoute');
//-----------------------

const app = express();
app.use(cors());

/*
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
*/
app.use(express.json());
app.use(express.urlencoded({extended: true}));


mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');

        app.listen(PORT, () => {
            console.log(`server started & running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    });


//----------------------- Routes
app.use('/api/v1/configs', configRoute);
app.use('/api/v1/profiles', profileRoute);
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/authors', authorRoute);
app.use('/api/v1/books', bookRoute);
app.use('/api/v1/admissions', admissionRoute);
app.use('/api/v1/fines', fineRoute);
app.use('/api/v1/reservations', reservationRoute);
app.use('/api/v1/transactions', transactionRoute);
app.use('/api/v1/subscriptions', subscriptionRoute);
//-----------------------