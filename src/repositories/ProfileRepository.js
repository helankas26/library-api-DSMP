const mongoose = require("mongoose");

const Profile = require('../models/ProfileSchema');
const User = require('../models/UserSchema');
const idGenerate = require("../utils/IdGenerateUtil");
const UnprocessableError = require("../errors/UnprocessableError");
const Admission = require("../models/AdmissionSchema");
const Config = require("../models/ConfigSchema");
const {filterReqObj} = require("../utils/FilterRequestUtil");

const findAllProfiles = async () => {
    try {
        return await Profile.find();
    } catch (error) {
        throw error;
    }
}

const findAllMembers = async () => {
    try {
        return await Profile.find({type: 'MEMBER'})
            .select(['-email', '-telNo', '-address', '-createdAt']);
    } catch (error) {
        throw error;
    }
}

const findAllProfilesWithPagination = async (page, size) => {
    try {
        const totalCount = await Profile.countDocuments();
        const totalPages = Math.ceil(totalCount / size);
        const skip = (page - 1) * size;
        const from = skip + 1;

        const profiles = await Profile.find({}).sort({createdAt: 'desc'}).skip(skip).limit(size);
        const to = skip + profiles.length;

        return {profiles, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }
}

const findAllProfilesBySearchWithPagination = async (searchText, page, size) => {
    try {
        const totalCount = await Profile.find({$text: {$search: searchText}}).countDocuments();
        const totalPages = Math.ceil(totalCount / size);
        const skip = (page - 1) * size;
        const from = skip + 1;

        const profiles = await Profile.find({$text: {$search: searchText}}).skip(skip).limit(size);
        const to = skip + profiles.length;

        return {profiles, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }
}

const findAllMembersPaymentStatus = async (page, size) => {
    try {
        const totalCount = await Profile.find({type: 'MEMBER', paymentStatus: {$gte: 1}}).countDocuments();
        const totalPages = Math.ceil(totalCount / size);
        const skip = (page - 1) * size;
        const from = skip + 1;

        const config = await Config.findOne();
        const subscriptionFee = config.subscription.fee;

        const tempProfiles = await Profile.find({type: 'MEMBER', paymentStatus: {$gte: 1}}).select({
            fullName: 1,
            avatar: 1,
            paymentStatus: 1
        }).skip(skip).limit(size);
        const to = skip + tempProfiles.length;

        const profiles = tempProfiles.map(profile => {
            const totalAmount = profile.paymentStatus * subscriptionFee;
            return {
                ...profile.toJSON(),
                fee: subscriptionFee,
                totalAmount: totalAmount
            };
        });

        return {profiles, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }
}

const findAllMembersPaymentStatusBySearch = async (searchText, page, size) => {
    try {
        const totalCount = await Profile.find({
            type: 'MEMBER',
            paymentStatus: {$gte: 1},
            $text: {$search: searchText}
        }).countDocuments();
        const totalPages = Math.ceil(totalCount / size);
        const skip = (page - 1) * size;
        const from = skip + 1;

        const config = await Config.findOne();
        const subscriptionFee = config.subscription.fee;

        const tempProfiles = await Profile.find({
            type: 'MEMBER',
            paymentStatus: {$gte: 1},
            $text: {$search: searchText}
        }).select({fullName: 1, avatar: 1, paymentStatus: 1}).skip(skip).limit(size);
        const to = skip + tempProfiles.length;

        const profiles = tempProfiles.map(profile => {
            const totalAmount = profile.paymentStatus * subscriptionFee;
            return {
                ...profile.toJSON(),
                fee: subscriptionFee,
                totalAmount: totalAmount
            };
        });

        return {profiles, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }
}

const findAllPaymentArrears = async (req) => {
    const role = req.user.role;

    try {
        if (role === 'ADMIN') {
            return await Profile.find({type: 'MEMBER', paymentStatus: {$gt: 1}}).select({
                fullName: 1,
                avatar: 1,
                paymentStatus: 1
            });
        } else if (role === 'USER') {
            const profile = await Profile.findById(req.user.profile).select({fullName: 1, avatar: 1, paymentStatus: 1});

            return {
                ...profile.toJSON(),
                payments: Array.from({length: profile.paymentStatus}, (_, index) => ({
                    index: index,
                    payFor: new Date(new Date().getFullYear(), new Date().getMonth() - (profile.paymentStatus - (index + 1)))
                        .toLocaleString('en-US', {month: 'long', year: 'numeric'})
                }))
            };
        }
    } catch (error) {
        throw error;
    }
}

const createProfile = async (req) => {
    const profileData = req.body;

    try {
        const profile = new Profile({
            _id: await idGenerate.generateId(new Date(), await Profile.findByCreatedAtForCurrentMonth()),
            fullName: profileData.fullName,
            avatar: profileData.avatar,
            email: profileData.email,
            telNo: profileData.telNo,
            address: profileData.address,
            type: profileData.type
        });

        const savedProfile = await profile.save();
        if (!savedProfile) {
            throw new Error("Could not create profile. Try again!");
        }

        if (savedProfile.type.toString() === 'MEMBER') {
            try {
                const admission = new Admission({
                    fee: await (async () => {
                        const config = await Config.findOne();
                        return config.admission.fee;
                    })(),
                    member: savedProfile._id,
                    librarian: req.user.profile
                });

                const savedAdmission = await admission.save();
                if (!savedAdmission) {
                    throw new Error('Admission unpaid. Could not create profile. Try again!');
                }

                return {savedProfile, savedAdmission};
            } catch (error) {
                await Profile.findByIdAndDelete(savedProfile._id);
                throw error;
            }
        }

        return {savedProfile, undefined};
    } catch (error) {
        throw error;
    }
}

const findProfileById = async (params) => {
    try {
        return await Profile.findById(params.id);
    } catch (error) {
        throw error;
    }
}

const findMemberPaymentStatusById = async (params) => {
    try {
        const config = await Config.findOne();
        const subscriptionFee = config.subscription.fee;

        const tempProfile = await Profile.findById(params.id).select({fullName: 1, avatar: 1, paymentStatus: 1});

        return {
            ...tempProfile.toJSON(),
            fee: subscriptionFee,
            payments: Array.from({length: tempProfile.paymentStatus}, (_, index) => ({
                index: index,
                payFor: new Date(new Date().getFullYear(), new Date().getMonth() - (tempProfile.paymentStatus - (index + 1)))
                    .toLocaleString('en-US', {month: 'long', year: 'numeric'})
            }))
        };
    } catch (error) {
        throw error;
    }
}

const findProfileByAuthUser = async (req) => {
    try {
        return await Profile.findById(req.user.profile);
    } catch (error) {
        throw error;
    }
}

const getMemberCurrentLoansById = async (params) => {
    try {
        return await Profile.findById(params.id)
            .select(['-avatar', '-email', '-telNo', '-address', '-createdAt'])
            .populate({
                path: 'transactions',
                match: {status: {$in: ['BORROWED', 'OVERDUE']}},
                select: ['-librarian'],
                populate: {path: 'books', model: 'Book', select: ['-cover', '-description', '-createdAt']}
            });
    } catch (error) {
        throw error;
    }
}

const getMemberAvailableReservationsById = async (params) => {
    try {
        return await Profile.findById(params.id)
            .select(['-avatar', '-email', '-telNo', '-address', '-createdAt'])
            .populate({
                path: 'reservations',
                match: {status: {$in: ['RESERVED']}},
                populate: {path: 'book', model: 'Book', select: ['-description', '-createdAt']}
            });
    } catch (error) {
        throw error;
    }
}

const updateProfile = async (params, profileData) => {
    try {
        const update = {$set: {...profileData}};

        if (profileData.type) {
            const docToUpdate = await Profile.findById(params.id);

            if (profileData.type === 'LIBRARIAN') {
                update.$unset = {
                    paymentStatus: '',
                    reservationCount: '',
                    borrowCount: ''
                };
            } else if (profileData.type === 'MEMBER' && docToUpdate.type.toString() !== 'MEMBER') {
                update.$set = {
                    ...update.$set,
                    paymentStatus: 1,
                    reservationCount: 0,
                    borrowCount: 0
                };
            }
        }

        return await Profile.findByIdAndUpdate(params.id, update, {new: true, runValidators: false});
    } catch (error) {
        throw error;
    }
}

const updateProfileByAuthUser = async (req) => {
    try {
        const filterObj = filterReqObj(req.body, 'fullName', 'avatar', 'email', 'telNo', 'address');

        return await Profile.findByIdAndUpdate(req.user.profile, filterObj, {new: true, runValidators: true});
    } catch (error) {
        throw error;
    }
}

const incrementPaymentStatus = async () => {
    try {
        return await Profile.updateMany(
            {type: 'MEMBER', paymentStatus: {$exists: true}},
            {$inc: {paymentStatus: 1}},
            {new: true, runValidators: true}
        );
    } catch (error) {
        throw error;
    }
}

const deleteProfile = async (params) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const user = await User.findOne({profile: params.id}).session(session);
        if (user) {
            throw new UnprocessableError('Could not delete. This profile associated with user account!');
        }

        await Admission.findOneAndDelete({member: params.id}).session(session);
        const profile = await Profile.findByIdAndDelete(params.id).session(session);

        await session.commitTransaction();
        return profile;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
}

module.exports = {
    findAllProfiles,
    findAllMembers,
    findAllProfilesWithPagination,
    findAllProfilesBySearchWithPagination,
    findAllMembersPaymentStatus,
    findAllMembersPaymentStatusBySearch,
    findAllPaymentArrears,
    createProfile,
    findProfileById,
    findMemberPaymentStatusById,
    findProfileByAuthUser,
    getMemberCurrentLoansById,
    getMemberAvailableReservationsById,
    updateProfile,
    updateProfileByAuthUser,
    incrementPaymentStatus,
    deleteProfile
}