const knex = require('../../db/knex1');

// get all the data from drug table.
const getDatasetTableData = function(req,res) {
    knex.select()
        .from('datasets')
        .then((dataset) => {
            res.send(dataset);
        })
        .catch((error) => res.status(500).json({
            status: 'could not find data from dataset table, getDatasetTableData',
            data: error
        }))
}


module.exports = {
    getDatasetTableData
}