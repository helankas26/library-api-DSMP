const Fine = require('../models/FineSchema');

const findAllFines = async () => {
    try {
        return await Fine.find();
    } catch (error) {
        throw error;
    }
}

const createFine = async (req) => {
    try {
        const fineData = req.body;

        const fine = new Fine({
            fee: fineData.fee,
            member: fineData.member,
            book: fineData.book,
            noOfDate: fineData.noOfDate,
            librarian: req.user.profile
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

const updateFine = async (params, req) => {
    try {
        const fineData = req.body;

        return await Fine.findByIdAndUpdate(params.id, {
                $set: {
                    fee: fineData.fee,
                    librarian: req.user.profile
                }
            }, {new: true, runValidators: true}
        );
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