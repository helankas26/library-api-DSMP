const {Schema, model} = require('mongoose');

const Profile = require('./ProfileSchema');

const configSchema = new Schema({
    admission: {
        fee: {
            type: Number,
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
            },
        },
        updateAt: {
            type: Date,
            required: true,
            default: () => Date.now()
        },
    },
    subscription: {
        fee: {
            type: Number,
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
            },
        },
        updateAt: {
            type: Date,
            required: true,
            default: () => Date.now()
        },
    },
    fine: {
        fee: {
            type: Number,
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
            },
        },
        updateAt: {
            type: Date,
            required: true,
            default: () => Date.now()
        },
    },
    noOfReservation: {
        count: {
            type: Number,
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
            },
        },
        updateAt: {
            type: Date,
            required: true,
            default: () => Date.now()
        },
    },
    noOfBorrow: {
        count: {
            type: Number,
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
            },
        },
        updateAt: {
            type: Date,
            required: true,
            default: () => Date.now()
        },
    },
    borrowableDate: {
        count: {
            type: Number,
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
            },
        },
        updateAt: {
            type: Date,
            required: true,
            default: () => Date.now()
        },
    },
    createdAt: {
        type: Date,
        required: true,
        default: () => Date.now(),
        immutable: true,
    },
});

module.exports = model('Config', configSchema);