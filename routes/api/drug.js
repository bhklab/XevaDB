/* eslint-disable func-names */
const knex = require('../../db/knex1');


// get all the data from drug table.
const getDrugs = function (request, response) {
    // if the user is not logged in the dataset id's would be between 1 to 6, else 1 to 8.
    const datasetArray = response.locals.user === 'unknown' ? [1, 6] : [1, 8];
    // selecting drug list based on dataset list.
    knex.distinct('drugs.drug_id')
        .select('drug_name', 'standard_name', 'targets', 'treatment_type', 'class', 'class_name', 'pubchemid')
        .from('drugs')
        .leftJoin(
            'drug_annotations',
            'drugs.drug_id',
            'drug_annotations.drug_id',
        )
        .leftJoin(
            'model_information',
            'drugs.drug_id',
            'model_information.drug_id',
        )
        .whereBetween('model_information.dataset_id', datasetArray)
        .orderBy('drug_name', 'asc')
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
    // if the user is not logged in the dataset id's would be between 1 to 6, else 1 to 8.
    const datasetArray = response.locals.user === 'unknown' ? [1, 6] : [1, 8];
    // select the number of patients and models grouped by drug class name.
    knex('model_information')
        .count('model_information.patient_id as model_ids')
        .leftJoin(
            'drugs',
            'model_information.drug_id',
            'drugs.drug_id',
        )
        .leftJoin(
            'drug_annotations',
            'drugs.drug_id',
            'drug_annotations.drug_id'
        )
        .select('class_name')
        .whereBetween('model_information.dataset_id', datasetArray)
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
