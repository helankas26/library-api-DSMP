const Config = require('../models/ConfigSchema')

const findAllConfigs = async () => {
    try {
        return Config.find();
    } catch (error) {
        throw error;
    }
}

const createConfig = async (configData) => {
    try {
        const config = new Config({
            admission: {
                fee: configData.admission.fee,
                librarian: configData.user.profile
            },
            subscription: {
                fee: configData.subscription.fee,
                librarian: configData.user.profile
            },
            fine: {
                fee: configData.fine.fee,
                librarian: configData.user.profile
            },
            noOfReservation: {
                count: configData.noOfReservation.count,
                librarian: configData.user.profile
            },
            noOfBorrow: {
                count: configData.noOfBorrow.count,
                librarian: configData.user.profile
            },
            borrowableDate: {
                count: configData.borrowableDate.count,
                librarian: configData.user.profile
            },
        });

        return await config.save();
    } catch (error) {
        throw error;
    }

}

const findConfigById = async (params) => {
    try {
        return Config.findById(params.id);
    } catch (error) {
        throw error;
    }
}

const updateConfig = async (params, configData) => {
    try {
        return Config.findByIdAndUpdate(params.id, configData, {new: true});
    } catch (error) {
        throw error;
    }
}

const deleteConfig = async (params) => {
    try {
        return Config.findByIdAndDelete(params.id);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findAllConfigs, createConfig, findConfigById, updateConfig, deleteConfig
}