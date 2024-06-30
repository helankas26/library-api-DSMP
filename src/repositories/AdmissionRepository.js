const Admission = require('../models/AdmissionSchema');
const Config = require("../models/ConfigSchema");
const Profile = require('../models/ProfileSchema');


const findAllAdmissions = async () => {
    try {
        return await Admission.find();
    } catch (error) {
        throw error;
    }
}

const findAllAdmissionsWithPagination = async (page, size) => {
    try {
        const totalCount = await Admission.countDocuments();
        const totalPages = Math.ceil(totalCount / size);
        const skip = (page - 1) * size;
        const from = skip + 1;

        const admissions = await Admission.find({}).sort({createdAt: 'desc'}).skip(skip).limit(size)
            .populate({path: 'member', select: ['fullName', 'avatar']})
            .populate({path: 'librarian', select: ['fullName']});
        const to = skip + admissions.length;

        return {admissions, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }
}

const findAllAdmissionsBySearchWithPagination = async (searchText, page, size) => {
    try {
        const profiles = await Profile.find({$text: {$search: searchText}}).select('_id');
        const searchedProfileIds = profiles.map(profile => profile._id);

        const totalCount = await Admission.find({
            $or: [
                {$text: {$search: searchText}},
                {member: {$in: searchedProfileIds}},
                {librarian: {$in: searchedProfileIds}}
            ]
        }).countDocuments();
        const totalPages = Math.ceil(totalCount / size);
        const skip = (page - 1) * size;
        const from = skip + 1;

        const admissions = await Admission.find({
            $or: [
                {$text: {$search: searchText}},
                {member: {$in: searchedProfileIds}},
                {librarian: {$in: searchedProfileIds}}
            ]
        }).skip(skip).limit(size)
            .populate({path: 'member', select: ['fullName', 'avatar']})
            .populate({path: 'librarian', select: ['fullName']});
        const to = skip + admissions.length;

        return {admissions, totalCount, totalPages, from, to};
    } catch (error) {
        throw error;
    }
}

const createAdmission = async (req) => {
    try {
        const admissionData = req.body;

        const admission = new Admission({
            fee: admissionData.fee ? admissionData.fee : await (async () => {
                const config = await Config.findOne();
                return config.admission.fee;
            })(),
            member: admissionData.member,
            librarian: req.user.profile
        });

        return await admission.save();
    } catch (error) {
        throw error;
    }
}

const findAdmissionById = async (params) => {
    try {
        return await Admission.findById(params.id)
            .populate({path: 'member', select: ['fullName', 'avatar']})
            .populate({path: 'librarian', select: ['fullName']});
    } catch (error) {
        throw error;
    }
}

const updateAdmission = async (params, req) => {
    try {
        const admissionData = req.body;

        return await Admission.findByIdAndUpdate(params.id, {
                $set: {
                    fee: admissionData.fee,
                    librarian: req.user.profile
                }
            }, {new: true, runValidators: true}
        );
    } catch (error) {
        throw error;
    }
}

const deleteAdmission = async (params) => {
    try {
        return await Admission.findByIdAndDelete(params.id);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findAllAdmissions,
    findAllAdmissionsWithPagination,
    findAllAdmissionsBySearchWithPagination,
    createAdmission,
    findAdmissionById,
    updateAdmission,
    deleteAdmission
}