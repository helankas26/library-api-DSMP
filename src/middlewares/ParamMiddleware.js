const verifyId = async (req, res, next, id, Model) => {
    try {
        let document = await Model.findById(id);

        if (!document) {
            return res.status(404).json({
                status: "fail",
                message: `Document with ID ${id} not found for ${Model.modelName}`
            });
        }

        req.document = document;
        next();
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: err.message
        });
    }
}

module.exports = {
    verifyId
}