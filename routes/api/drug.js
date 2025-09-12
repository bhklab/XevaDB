/* eslint-disable func-names */
const knex = require('../../db/knex1');
const { isVerified } = require('./util');
const { getAllowedDatasetIds } = require('./util');

// ***************************** Drug Queries ******************************************
// query to get the drug data
const drugQuery = () => (
    knex.distinct('dg.drug_id')
        .select('drug_name', 'standard_name', 'targets', 'treatment_type', 'class', 'class_name', 'pubchemid')
        .from('drugs as dg')
        .leftJoin('drug_annotations as da', 'dg.drug_id', 'da.drug_id')
        .leftJoin('datasets_drugs as dd', 'dd.drug_id', 'dg.drug_id')
        .leftJoin('datasets as d', 'd.dataset_id', 'dd.dataset_id')
);

// **************************** API Endpoint Functions ****************************************
/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @param {string} response.locals.user - whether the user is verified or not ('unknown').
 * @returns {Object} - list of the drugs with drug annotations.
 */
const getAllDrugs = (request, response) => {
    // user variable.
    const { user } = response.locals;

    // selecting drug list based on dataset list.
    drugQuery()
        .whereIn('d.dataset_id', getAllowedDatasetIds(user))
        .orderBy('dg.drug_name', 'asc')
        .then((drugs) => {
            response.send(drugs);
        })
        .catch((error) => response.status(500).json({
            status: 'could not find data from drug table, getDrugs',
            data: error,
        }));
};

/**
 *
 * @param {Object} request - request object
 * @param {Object} response - response object with authorization header
 * @returns {Object} - single drug information
 */
const getSingleDrugInformation = (request, response) => {
    // user variable
    const { user } = response.locals;

    // drug param
    const { params: { drug: drugParam } } = request;

    // selecting drug list based on dataset list.
    drugQuery()
        .whereIn('d.dataset_id', getAllowedDatasetIds(user))
        .where('dg.drug_id', drugParam)
        .then((drugInformation) => {
            response.send(drugInformation);
        })
        .catch((error) => response.status(500).json({
            status: 'could not find data from drug table, getSingleDrugInformation',
            data: error,
        }));
};

module.exports = {
    getAllDrugs,
    getSingleDrugInformation,
};
