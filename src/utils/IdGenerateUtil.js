const generateId = async (createDate, collection) => {
    const year = createDate.getFullYear().toString();
    const month = (createDate.getMonth() + 1) < 10 ? "0" + (createDate.getMonth() + 1).toString() : (createDate.getMonth() + 1).toString();
    const date = createDate.getDate().toString();
    const prefix = year + month + date;
    createDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(date))

    const docCount = collection.length

    if (docCount > 0) {
        const lastId = collection[docCount - 1]._id;
        const previousYear = lastId.slice(0, 4);
        let previousMonth = parseInt(lastId.slice(4, 6)) - 1;
        const previousDate = lastId.slice(6, 8);
        const previousPrefixDate = new Date(previousYear, previousMonth, previousDate);

        const previousPrefix = lastId.slice(0, 8);
        let counter = parseInt(lastId.slice(8, 10));

        if (createDate.getTime() === previousPrefixDate.getTime()) {
            if (counter < 99) {
                if (counter < 9) {
                    return previousPrefix + "0" + (++counter);
                } else {
                    return previousPrefix + (++counter);
                }
            } else {
                return undefined;
            }
        }
    } else if (docCount === 0) {
        return prefix + "00";
    }
}

module.exports = {generateId};