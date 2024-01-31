const fineService = require('../services/FineService');
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const {sendResponse} = require("../utils/SendResponseUtil");


const findAllFines = asyncErrorHandler(async (req, resp, next) => {
    const fines = await fineService.findAllFines();
    await sendResponse(resp, 200, {fines: fines, count: fines.length});
});

const createFine = asyncErrorHandler(async (req, resp, next) => {
    const fine = await fineService.createFine(req);
    await sendResponse(resp, 201, {fine});
});

const findFineById = asyncErrorHandler(async (req, resp, next) => {
    const fine = await fineService.findFineById(req.params);
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
    findAllFines, createFine, findFineById, updateFine, deleteFine
}