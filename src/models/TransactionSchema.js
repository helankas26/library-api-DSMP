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
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

transactionSchema.index({books: "text", member: "text", status: "text", librarian: "text"});
transactionSchema.index({books: 1});
transactionSchema.index({member: 1});
transactionSchema.index({librarian: 1});

transactionSchema.virtual('noOfDate').get(function () {
    const today = new Date();
    const dueDate = new Date(this.dueAt);
    today.setHours(0, 0, 0, 0);

    if (['BORROWED', 'OVERDUE'].includes(this.status) && today > dueDate) {
        const delay = Math.ceil((today - dueDate) / (24 * 60 * 60 * 1000));
        return Math.max(0, delay);
    }
});

module.exports = model('Transaction', transactionSchema);