const filterReqObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).filter(prop => {
        if (allowedFields.includes(prop))
            newObj[prop] = obj[prop];
    });

    return newObj;
}

module.exports = {filterReqObj};