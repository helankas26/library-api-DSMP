const {Schema, model} = require('mongoose');
const Profile = require('./ProfileSchema');
const Config = require("./ConfigSchema");

const subscriptionSchema = new Schema({
    fee: {
        type: Number,
        required: true,
        validate: {
            validator: async (value) => {
                const config = await Config.findOne();
                return value >= 0 && value <= config.subscription.fee;
            }
        }
    },
    paidFor: {
        type: String,
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
    paidAt: {
        type: Date,
        required: true,
        default: () => Date.now(),
        immutable: true
    },
    updateAt: {
        type: Date
    },
});

module.exports = model('Subscription', subscriptionSchema);