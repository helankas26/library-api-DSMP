const NotFoundError = require("../errors/NotFoundError");

const verifyId = async (req, res, next, id, Model) => {
    try {
        let document = await Model.findById(id);

        if (!document) {
            throw new NotFoundError(`Document with ID ${id} not found for ${Model.modelName}`);
        }

        req.document = document;
        next();
    } catch (err) {
        return next(err);
    }
}

module.exports = {
    verifyId
}