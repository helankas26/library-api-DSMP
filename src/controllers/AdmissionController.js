const admissionService = require('../services/AdmissionService');
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const {sendResponse} = require("../utils/SendResponseUtil");


const findAllAdmissions = asyncErrorHandler(async (req, resp, next) => {
    const admissions = await admissionService.findAllAdmissions();
    await sendResponse(resp, 200, {admissions: admissions, count: admissions.length});
});

const findAllAdmissionsWithPagination = asyncErrorHandler(async (req, resp, next) => {
    const admissionsWithPagination = await admissionService.findAllAdmissionsWithPagination(req);
    await sendResponse(resp, 200, admissionsWithPagination);
});

const findAllAdmissionsBySearchWithPagination = asyncErrorHandler(async (req, resp, next) => {
    const admissionsWithPagination = await admissionService.findAllAdmissionsBySearchWithPagination(req);
    await sendResponse(resp, 200, admissionsWithPagination);
});

const createAdmission = asyncErrorHandler(async (req, resp, next) => {
    const admission = await admissionService.createAdmission(req);
    await sendResponse(resp, 201, {admission});
});

const findAdmissionById = asyncErrorHandler(async (req, resp, next) => {
    const admission = await admissionService.findAdmissionById(req.params);
    await sendResponse(resp, 200, {admission});
});

const updateAdmission = asyncErrorHandler(async (req, resp, next) => {
    const admission = await admissionService.updateAdmission(req.params, req)
    await sendResponse(resp, 201, {admission});
});

const deleteAdmission = asyncErrorHandler(async (req, resp, next) => {
    const admission = await admissionService.deleteAdmission(req.params);
    await sendResponse(resp, 204, {id: admission.id});
});

module.exports = {
    findAllAdmissions,
    findAllAdmissionsWithPagination,
    findAllAdmissionsBySearchWithPagination,
    createAdmission,
    findAdmissionById,
    updateAdmission,
    deleteAdmission
}