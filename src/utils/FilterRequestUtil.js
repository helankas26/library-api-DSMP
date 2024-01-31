const filterReqObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).filter(prop => {
        if (allowedFields.includes(prop))
            newObj[prop] = obj[prop];
    });

    return newObj;
}

const updateConfigReqObj = (req) => {
    const obj = req.body;

    const newObj = {};
    Object.keys(obj).map(prop => {
        obj[prop].librarian = req.user.profile;
        obj[prop].updateAt = Date.now();
        newObj[prop] = obj[prop];
    });

    return newObj;
}

module.exports = {filterReqObj, updateConfigReqObj};