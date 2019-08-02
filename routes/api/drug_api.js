const knex = require('../../db/knex1');

// get all the data from drug table.
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


// this will get the patients/model ids belonging a class of drug.
const getDrugClassName = function(req, res) {
    knex('model_information')
        .count('model_information.patient_id as model_ids')
        .leftJoin(
            'drug',
            'model_information.drug',
            'drug.drug_id'
        )
        .select('class_name')
        .groupBy('class_name')
        .then((class_name) => res.status(200).json({
            status: 'success',
            data: class_name
          }))
        .catch((error) => res.status(500).json({
            status: 'could not find data from drug table, getDrugData',
            data: error
        }))
}





module.exports = {
    getDrugTableData,
    getDrugClassName
}