const Admission = require('../models/AdmissionSchema');
const Config = require("../models/ConfigSchema");

const findAllAdmissions = async () => {
    try {
        return await Admission.find();
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
        return await Admission.findById(params.id);
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
    findAllAdmissions, createAdmission, findAdmissionById, updateAdmission, deleteAdmission
}