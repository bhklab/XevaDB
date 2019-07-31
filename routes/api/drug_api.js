const knex = require('../../db/knex1');


const getDrugTableData = function(req,res) {
    knex.select()
        .from('drug')
        .then((drug) => {
            res.send(drug);
        })
        .catch((error) => res.status(500).json({
            status: 'could not find data from drug table, getDrugData',
            data: error
        }))
}

module.exports = {
    getDrugTableData
}