/* eslint-disable func-names */
const knex = require('../../db/knex1');
const { getAllowedDatasetIds } = require('./util');


/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @returns {Object} - list of the drugs with drug annotations.
 */
const getDrugs = (request, response) => {
    // user variable.
    const { user } = response.locals;

    // selecting drug list based on dataset list.
    knex.distinct('dg.drug_id')
        .select('drug_name', 'standard_name', 'targets', 'treatment_type', 'class', 'class_name', 'pubchemid')
        .from('drugs as dg')
        .leftJoin('drug_annotations as da', 'dg.drug_id', 'da.drug_id')
        .leftJoin('datasets_drugs as dd', 'dd.drug_id', 'dg.drug_id')
        .leftJoin('datasets as d', 'd.dataset_id', 'dd.dataset_id')
        .whereBetween('d.dataset_id', getAllowedDatasetIds(user))
        .orderBy('dg.drug_name', 'asc')
        .then((drugs) => {
            response.send(drugs);
        })
        .catch((error) => response.status(500).json({
            status: 'could not find data from drug table, getDrugs',
            data: error,
        }));
};


module.exports = {
    getDrugs,
};
