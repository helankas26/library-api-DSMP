const admissionRepository = require('../repositories/AdmissionRepository');

const findAllAdmissions = async () => {
    try {
        return await admissionRepository.findAllAdmissions();
    } catch (error) {
        throw error;
    }
}

const createAdmission = async (reqBody) => {
    try {
        return await admissionRepository.createAdmission(reqBody);
    } catch (error) {
        throw error;
    }
}

const findAdmissionById = async (reqParams) => {
    try {
        return await admissionRepository.findAdmissionById(reqParams);
    } catch (error) {
        throw error;
    }
}

const updateAdmission = async (reqParams, reqBody) => {
    try {
        return await admissionRepository.updateAdmission(reqParams, reqBody);
    } catch (error) {
        throw error;
    }
}

const deleteAdmission = async (reqParams) => {
    try {
        return await admissionRepository.deleteAdmission(reqParams);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findAllAdmissions, createAdmission, findAdmissionById, updateAdmission, deleteAdmission
}