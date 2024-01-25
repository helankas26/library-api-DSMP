const Admission = require('../models/AdmissionSchema');

const findAllAdmissions = async () => {
    try {
        return await Admission.find();
    } catch (error) {
        throw error;
    }
}

const createAdmission = async (admissionData) => {
    try {
        const admission = new Admission({
            fee: admissionData.fee,
            member: admissionData.member,
            librarian: admissionData.user.profile
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

const updateAdmission = async (params, admissionData) => {
    try {
        return await Admission.findByIdAndUpdate(params.id, admissionData, {new: true});
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