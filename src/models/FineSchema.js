import mongoose from 'mongoose';

const {Schema, model} = mongoose;
const Profile = require('./ProfileSchema');

const fineSchema = new Schema({
    fee: {
        type: Number,
        required: true
    },
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
    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    },
    noOfDate: {
        type: Number,
        required: true
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
    createdAt: {
        type: Date,
        required: true,
        default: () => Date.now(),
        immutable: true,
    },
});

module.exports = model('Fine', fineSchema);