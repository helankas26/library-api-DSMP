const admissionRepository = require('../repositories/AdmissionRepository');

const findAllAdmissions = async () => {
    try {
        return await admissionRepository.findAllAdmissions();
    } catch (error) {
        throw error;
    }
}

const findAllAdmissionsWithPagination = async (req) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 24;

    try {
        return await admissionRepository.findAllAdmissionsWithPagination(page, size);
    } catch (error) {
        throw error;
    }
}

const findAllAdmissionsBySearchWithPagination = async (req) => {
    const searchText = req.query.searchText;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 24;

    try {
        return await admissionRepository.findAllAdmissionsBySearchWithPagination(searchText, page, size);
    } catch (error) {
        throw error;
    }
}

const createAdmission = async (req) => {
    try {
        return await admissionRepository.createAdmission(req);
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

const updateAdmission = async (reqParams, req) => {
    try {
        return await admissionRepository.updateAdmission(reqParams, req);
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
    findAllAdmissions,
    findAllAdmissionsWithPagination,
    findAllAdmissionsBySearchWithPagination,
    createAdmission,
    findAdmissionById,
    updateAdmission,
    deleteAdmission
}