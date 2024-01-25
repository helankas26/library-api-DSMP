const Fine = require('../models/FineSchema');

const findAllFines = async () => {
    try {
        return await Fine.find();
    } catch (error) {
        throw error;
    }
}

const createFine = async (fineData) => {
    try {
        const fine = new Fine({
            fee: fineData.fee,
            member: fineData.member,
            book: fineData.book,
            noOfDate: fineData.noOfDate,
            librarian: fineData.user.profile
        });

        return await fine.save();
    } catch (error) {
        throw error;
    }
}

const findFineById = async (params) => {
    try {
        return await Fine.findById(params.id);
    } catch (error) {
        throw error;
    }
}

const updateFine = async (params, fineData) => {
    try {
        return await Fine.findByIdAndUpdate(params.id, fineData, {new: true});
    } catch (error) {
        throw error;
    }
}

const deleteFine = async (params) => {
    try {
        return await Fine.findByIdAndDelete(params.id);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findAllFines, createFine, findFineById, updateFine, deleteFine
}