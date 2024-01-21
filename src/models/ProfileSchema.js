import mongoose from 'mongoose';

const {Schema, model} = mongoose;
const Config = require('./ConfigSchema');

const profileSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    telNo: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['LIBRARIAN', 'MEMBER'],
        required: true,
        default: "MEMBER",
    },
    reservationCount: {
        type: Number,
        required: true,
        default: 0,
        validate: {
            validator: async (value) => {
                const config = await Config.findOne();
                return value >= 0 && value <= config.noOfReservation.count;
            }
        },
    },
    borrowCount: {
        type: Number,
        required: true,
        default: 0,
        validate: {
            validator: async (value) => {
                const config = await Config.findOne();
                return value >= 0 && value <= config.noOfBorrow.count;
            }
        },
    },
    createdAt: {
        type: Date,
        required: true,
        default: () => Date.now(),
        immutable: true,
    },
});

module.exports = model('Profile', profileSchema);