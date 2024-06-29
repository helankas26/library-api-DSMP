const fineService = require('../services/FineService');
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const {sendResponse} = require("../utils/SendResponseUtil");


const findAllFines = asyncErrorHandler(async (req, resp, next) => {
    const fines = await fineService.findAllFines();
    await sendResponse(resp, 200, {fines: fines, count: fines.length});
});

const findAllFinesWithPagination = asyncErrorHandler(async (req, resp, next) => {
    const finesWithPagination = await fineService.findAllFinesWithPagination(req);
    await sendResponse(resp, 200, finesWithPagination);
});

const findAllFinesBySearchWithPagination = asyncErrorHandler(async (req, resp, next) => {
    const finesWithPagination = await fineService.findAllFinesBySearchWithPagination(req);
    await sendResponse(resp, 200, finesWithPagination);
});

const findAllFinesWithPaginationByAuthUser = asyncErrorHandler(async (req, resp, next) => {
    const finesWithPagination = await fineService.findAllFinesWithPaginationByAuthUser(req);
    await sendResponse(resp, 200, finesWithPagination);
});

const findAllFinesBySearchWithPaginationByAuthUser = asyncErrorHandler(async (req, resp, next) => {
    const finesWithPagination = await fineService.findAllFinesBySearchWithPaginationByAuthUser(req);
    await sendResponse(resp, 200, finesWithPagination);
});

const createFine = asyncErrorHandler(async (req, resp, next) => {
    const fines = await fineService.createFine(req);
    await sendResponse(resp, 201, {fines});
});

const findFineById = asyncErrorHandler(async (req, resp, next) => {
    const fine = await fineService.findFineById(req.params);
    await sendResponse(resp, 200, {fine});
});

const findFineByIdWithByAuthUser = asyncErrorHandler(async (req, resp, next) => {
    const fine = await fineService.findFineByIdWithByAuthUser(req);
    await sendResponse(resp, 200, {fine});
});

const updateFine = asyncErrorHandler(async (req, resp, next) => {
    const fine = await fineService.updateFine(req.params, req);
    await sendResponse(resp, 201, {fine});
});

const deleteFine = asyncErrorHandler(async (req, resp, next) => {
    const fine = await fineService.deleteFine(req.params);
    await sendResponse(resp, 204, {id: fine.id});
});

module.exports = {
    findAllFines,
    findAllFinesWithPagination,
    findAllFinesBySearchWithPagination,
    findAllFinesWithPaginationByAuthUser,
    findAllFinesBySearchWithPaginationByAuthUser,
    createFine,
    findFineById,
    findFineByIdWithByAuthUser,
    updateFine,
    deleteFine
}