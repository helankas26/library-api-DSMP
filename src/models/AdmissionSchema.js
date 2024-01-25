const {Schema, model} = require('mongoose');

const Profile = require('./ProfileSchema');
const Config = require('./ConfigSchema');

const admissionSchema = new Schema({
    fee: {
        type: Number,
        required: true,
        default: async () => {
            const config = await Config.findOne();
            return config.admission.fee;
        },
        validate: {
            validator: async (value) => {
                const config = await Config.findOne();
                return value >= 0 && value <= config.admission.fee;
            }
        }
    },
    member: {
        type: String,
        ref: 'Profile',
        required: true,
        unique: true,
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
    createdAt: {
        type: Date,
        required: true,
        default: () => Date.now(),
        immutable: true
    }
});

module.exports = model('Admission', admissionSchema);