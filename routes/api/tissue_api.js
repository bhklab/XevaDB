const knex = require('../../db/knex1');


// get all the data from the tissues table.
const getTissues = function(request, response) {
    knex.select()
        .from('tissues')
        .then((tissue) => response.status(200).json({
            status: 'success',
            data: tissue
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data from tissue table, getTissues',
            data: error
        }))
}



module.exports = {
    getTissues
}