/* eslint-disable func-names */
const knex = require('../../db/knex1');


// get all the data from drug table.
const getDrugs = function (request, response) {
    knex.select()
        .from('drugs')
        .then((drug) => {
            response.send(drug);
        })
        .catch((error) => response.status(500).json({
            status: 'could not find data from drug table, getDrugs',
            data: error,
        }));
};


// this will get the drugs grouped by class.
const getDrugGroupedByClass = function (request, response) {
    // console.log(response.locals.user, 'this is user')
    knex('model_information')
        .count('model_information.patient_id as model_ids')
        .leftJoin(
            'drugs',
            'model_information.drug_id',
            'drugs.drug_id',
        )
        .select('class_name')
        .groupBy('class_name')
        .then((className) => response.status(200).json({
            status: 'success',
            data: className,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data from drug table, getDrugClass',
            data: error,
        }));
};


module.exports = {
    getDrugs,
    getDrugGroupedByClass,
};
