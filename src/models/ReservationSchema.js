const {Schema, model} = require('mongoose');
const Profile = require('./ProfileSchema');

const reservationSchema = new Schema({
    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
        immutable: true
    },
    member: {
        type: String,
        ref: 'Profile',
        required: true,
        validate: {
            validator: async (value) => {
                const user = await Profile.findOne({_id: value, type: 'MEMBER'});
                return !!user;
            }
        },
        immutable: true
    },
    status: {
        type: String,
        default: 'RESERVED',
        enum: ['RESERVED', 'CANCELLED', 'BORROWED', 'EXPIRED'],
        required: true
    },
    reservationAt: {
        type: Date,
        required: true,
        default: () => Date.now(),
        immutable: true
    },
    dueAt: {
        type: Date,
        required: true,
        default: () => Date.now() + 4 * 24 * 60 * 60 * 1000,
        immutable: true
    }
});

module.exports = model('Reservation', reservationSchema);