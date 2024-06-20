const fineRepository = require('../repositories/FineRepository');

const findAllFines = async () => {
    try {
        return await fineRepository.findAllFines();
    } catch (error) {
        throw error;
    }
}

const findAllFinesWithPagination = async (req) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 24;

    try {
        return await fineRepository.findAllFinesWithPagination(page, size);
    } catch (error) {
        throw error;
    }
}

const findAllFinesBySearchWithPagination = async (req) => {
    const searchText = req.query.searchText;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 24;

    try {
        return await fineRepository.findAllFinesBySearchWithPagination(searchText, page, size);
    } catch (error) {
        throw error;
    }
}

const findAllFinesWithPaginationByAuthUser = async (req) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 24;

    try {
        return await fineRepository.findAllFinesWithPaginationByAuthUser(req, page, size);
    } catch (error) {
        throw error;
    }
}

const findAllFinesBySearchWithPaginationByAuthUser = async (req) => {
    const searchText = req.query.searchText;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 24;

    try {
        return await fineRepository.findAllFinesBySearchWithPaginationByAuthUser(req, searchText, page, size);
    } catch (error) {
        throw error;
    }
}

const createFine = async (req) => {
    try {
        return await fineRepository.createFine(req);
    } catch (error) {
        throw error;
    }
}

const findFineById = async (reqParams) => {
    try {
        return await fineRepository.findFineById(reqParams);
    } catch (error) {
        throw error;
    }
}

const findFineByIdWithByAuthUser = async (req) => {
    try {
        return await fineRepository.findFineByIdWithByAuthUser(req);
    } catch (error) {
        throw error;
    }
}

const updateFine = async (reqParams, req) => {
    try {
        return await fineRepository.updateFine(reqParams, req);
    } catch (error) {
        throw error;
    }
}

const deleteFine = async (reqParams) => {
    try {
        return await fineRepository.deleteFine(reqParams);
    } catch (error) {
        throw error;
    }
}

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