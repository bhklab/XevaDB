const knex = require('../../db/knex1');


// get all the data from drug table.
const getDrugs = function(request,response) {
    knex.select()
        .from('drugs')
        .then((drug) => {
            response.send(drug);
        })
        .catch((error) => response.status(500).json({
            status: 'could not find data from drug table, getDrugs',
            data: error
        }))
}



module.exports = {
    getDrugs
}