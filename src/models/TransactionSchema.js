const {Schema, model} = require('mongoose');
const Profile = require('./ProfileSchema');

const transactionSchema = new Schema({
    books: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Book',
            required: true
        }
    ],
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
        default: 'BORROWED',
        enum: ['BORROWED', 'RETURNED', 'OVERDUE'],
        required: true
    },
    librarian: {
        type: String,
        ref: 'Profile',
        required: true,
        validate: {
            validator: async (value) => {
                const user = await Profile.findOne({_id: value, type: 'LIBRARIAN'});
                return !!user;
            }
        }
    },
    issuedAt: {
        type: Date,
        required: true,
        default: () => Date.now(),
        immutable: true
    },
    dueAt: {
        type: Date,
        required: true,
        immutable: true
    },
    returnedAt: {
        type: Date
    }
});

module.exports = model('Transaction', transactionSchema);