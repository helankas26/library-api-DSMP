const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const bodyParser = require('body-parser');

dotenv.config();

const {PORT} = require('./config/serverConfig');

//----------------------- Routes import
const configRoute = require('./src/routes/api/ConfigRoute');
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
app.use('/api/v1/config', configRoute);
//-----------------------