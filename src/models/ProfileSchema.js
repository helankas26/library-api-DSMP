const {Schema, model} = require('mongoose');

const getConfigModel = () => require('./ConfigSchema');

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
        lowercase: true
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
        default: "MEMBER"
    },
    paymentStatus: {
        type: Number
    },
    reservationCount: {
        type: Number,
        required: true,
        default: 0,
        validate: {
            validator: async (value) => {
                if (this.type === 'MEMBER') {
                    const Config = getConfigModel();
                    const config = await Config.findOne();
                    return value >= 0 && value <= config.noOfReservation.count;
                }
            }
        }
    },
    borrowCount: {
        type: Number,
        required: true,
        default: 0,
        validate: {
            validator: async (value) => {
                if (this.type === 'MEMBER') {
                    const Config = getConfigModel();
                    const config = await Config.findOne();
                    return value >= 0 && value <= config.noOfBorrow.count;
                }
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

profileSchema.index({_id: "text", fullName: "text", email: "text", telNo: "text", address: "text"});

profileSchema.pre('save', function (next) {
    if (this.type === 'MEMBER' && this.isNew) {
        this.paymentStatus = 1;
    }

    if (this.type === 'LIBRARIAN') {
        this.reservationCount = undefined;
        this.borrowCount = undefined;
    }

    next();
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