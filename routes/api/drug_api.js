const knex = require('../../db/knex1');


// get all the data from drug table.
const getDrugs = function(req,res) {
    knex.select()
        .from('drugs')
        .then((drug) => {
            res.send(drug);
        })
        .catch((error) => res.status(500).json({
            status: 'could not find data from drug table, getDrugs',
            data: error
        }))
}



module.exports = {
    getDrugs
}