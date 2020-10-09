const sortQuery = (req, orderByFields, defaultField, defaultDir) => {
    const {orderBy, dir} = req.query
    let order = {}
    if (orderBy || defaultField) {
        if (orderByFields.includes(orderBy)) {
            if (dir && dir === 'asc' || dir === 'desc') {
                order = {[orderBy]: dir}
                return order
            } else {
                order = {[orderBy]: defaultDir}
                return order
            }
        } else {
            order  = {[defaultField]: defaultDir}
            return order
        }
    } else return
}

module.exports = sortQuery