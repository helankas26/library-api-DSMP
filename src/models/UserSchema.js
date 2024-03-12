const {Schema, model} = require('mongoose');

const Profile = require("./ProfileSchema");
const InvalidRegistrationKeyError = require("../errors/InvalidRegistrationKeyError");

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    profile: {
        type: String,
        ref: 'Profile',
        required: true,
        unique: true,
        immutable: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        select: false
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        required: true,
        default: "USER"
    },
    createdAt: {
        type: Date,
        required: true,
        default: () => Date.now(),
        immutable: true
    },
    passwordChangedAt: Date,
    otp: {
        type: String,
        select: false
    },
    otpExpires: {
        type: Date,
        select: false
    }
});

userSchema.pre('save', async function (next) {
    const user = await Profile.findOne({_id: this.profile});

    if (!user) {
        const error = new InvalidRegistrationKeyError('Invalid registration ID!');
        return next(error);
    }

    next();
});

userSchema.statics.findByUsernameOrProfile = function (username, profile) {
    return this.findOne({
        $or: [
            {username: username},
            {profile: profile}
        ]
    });
};

userSchema.statics.findByProfile = async function (profile) {
    return await this.findOne({profile: profile});
};

userSchema.statics.findByUsername = async function (username) {
    return await this.findOne({username: username}).select('+password');
};

userSchema.statics.findByEmail = async function (email) {
    const users = await this.find().populate('profile');
    return users.find(user => user.profile.email === email);
};

userSchema.statics.findByOtp = async function (otp) {
    return await this.findOne({otp: otp}).select('+otpExpires');
};

userSchema.statics.findByOtpWithExpires = async function (otp) {
    return await this.findOne({otp: otp, otpExpires: {$gt: Date.now()}});
};

userSchema.methods.isPasswordChanged = async function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const passwordChangedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < passwordChangedTimestamp;
    }

    return false;
};

module.exports = model('User', userSchema);