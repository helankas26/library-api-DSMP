const Config = require('../models/ConfigSchema')
const {updateConfigReqObj} = require("../utils/FilterRequestUtil");

const findAllConfigs = async () => {
    try {
        return await Config.find();
    } catch (error) {
        throw error;
    }
}

const createConfig = async (req) => {
    try {
        const configData = req.body;

        const config = new Config({
            admission: {
                fee: configData.admission.fee,
                librarian: req.user.profile
            },
            subscription: {
                fee: configData.subscription.fee,
                librarian: req.user.profile
            },
            fine: {
                fee: configData.fine.fee,
                librarian: req.user.profile
            },
            noOfReservation: {
                count: configData.noOfReservation.count,
                librarian: req.user.profile
            },
            noOfBorrow: {
                count: configData.noOfBorrow.count,
                librarian: req.user.profile
            },
            borrowableDate: {
                count: configData.borrowableDate.count,
                librarian: req.user.profile
            },
        });

        return await config.save();
    } catch (error) {
        throw error;
    }
}

const findConfigById = async (params) => {
    try {
        return await Config.findById(params.id);
    } catch (error) {
        throw error;
    }
}

const updateConfig = async (params, req) => {
    try {
        const configData = updateConfigReqObj(req);

        return await Config.findByIdAndUpdate(params.id, configData, {new: true, runValidators: true});
    } catch (error) {
        throw error;
    }
}

const deleteConfig = async (params) => {
    try {
        return await Config.findByIdAndDelete(params.id);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findAllConfigs, createConfig, findConfigById, updateConfig, deleteConfig
}