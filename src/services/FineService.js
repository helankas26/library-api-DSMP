const fineRepository = require('../repositories/FineRepository');

const findAllFines = async () => {
    try {
        return await fineRepository.findAllFines();
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
    findAllFines, createFine, findFineById, updateFine, deleteFine
}