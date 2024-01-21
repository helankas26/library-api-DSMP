import mongoose from 'mongoose';

const {Schema, model} = mongoose;
const Config = require('./ConfigSchema');
const Profile = require('./ProfileSchema');

const transactionSchema = new Schema({
    books: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Book',
            required: true,
        }
    ],
    member: {
        type: Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
        validate: {
            validator: async (value) => {
                const user = await Profile.findOne({_id: value, type: 'MEMBER'});
                return !!user;
            }
        },
    },
    status: {
        type: String,
        enum: ['BORROWED', 'RETURNED', 'OVERDUE'],
        required: true,
    },
    librarian: {
        type: Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
        validate: {
            validator: async (value) => {
                const user = await Profile.findOne({_id: value, type: 'LIBRARIAN'});
                return !!user;
            }
        },
    },
    borrowedAt: {
        type: Date,
        required: true,
        default: () => Date.now(),
        immutable: true,
    },
    returnAt: {
        type: Date,
        required: true,
        default: async () => {
            const config = await Config.findOne();
            return Date.now() + config.borrowableDate.count * 24 * 60 * 60 * 1000
        },
        immutable: true,
    },
});

module.exports = model('Transaction', transactionSchema);