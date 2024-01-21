import mongoose from 'mongoose';

const {Schema, model} = mongoose;
const Profile = require('./ProfileSchema');

const admissionSchema = new Schema({
    fee: {
        type: Number,
        required: true
    },
    librarian: {
        type: Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
        validate: {
            validator: async  (value) => {
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

module.exports = model('Admission', admissionSchema);