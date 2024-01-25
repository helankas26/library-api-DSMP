const {Schema, model} = require('mongoose');

const Profile = require('./ProfileSchema');
const Book = require('./BookSchema');

const fineSchema = new Schema({
    fee: {
        type: Number,
        required: true
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
    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
        validate: {
            validator: async (value) => {
                const book = await Book.findOne({_id: value});
                return !!book;
            }
        },
        immutable: true
    },
    noOfDate: {
        type: Number,
        required: true,
        immutable: true
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
    createdAt: {
        type: Date,
        required: true,
        default: () => Date.now(),
        immutable: true
    }
});

module.exports = model('Fine', fineSchema);