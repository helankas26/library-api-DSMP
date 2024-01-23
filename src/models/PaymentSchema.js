const {Schema, model} = require('mongoose');
const Profile = require('./ProfileSchema');

const paymentSchema = new Schema({
    amount: {
        type: Number,
        required: true,
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
    paidAt: {
        type: Date,
        required: true,
        default: () => Date.now(),
        immutable: true,
    }
});

module.exports = model('Payment', paymentSchema);