const {Schema, model} = require('mongoose');

const getProfileModel = () => require('./ConfigSchema');

const profileSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    telNo: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['LIBRARIAN', 'MEMBER'],
        required: true,
        default: "MEMBER",
    },
    reservationCount: {
        type: Number,
        required: true,
        default: 0,
        validate: {
            validator: async (value) => {
                const Config = getProfileModel();
                const config = await Config.findOne();
                return value >= 0 && value <= config.noOfReservation.count;
            }
        },
    },
    borrowCount: {
        type: Number,
        required: true,
        default: 0,
        validate: {
            validator: async (value) => {
                const Config = getProfileModel();
                const config = await Config.findOne();
                return value >= 0 && value <= config.noOfBorrow.count;
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

profileSchema.statics.findByCreatedAtForCurrentMonth = function () {
    return this.find({
        createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
            $lt: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1)
        }
    });
};

module.exports = model('Profile', profileSchema);