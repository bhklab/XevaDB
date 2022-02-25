/* eslint-disable func-names */
const knex = require('../../db/knex1');


// ************************************** Batch Queries ***************************************************
/**
 * @returns {Object} - a query to get the batch id
 */
const batchIdQuery = () => knex
    .select('batch_information.batch_id', 'model_information.dataset_id')
    .from('batch_information')
    .join(
        'model_information',
        'batch_information.model_id',
        'model_information.model_id',
    )
    .join(
        'patients',
        'model_information.patient_id',
        'patients.patient_id',
    )
    .join(
        'drugs',
        'model_information.drug_id',
        'drugs.drug_id',
    );


// ************************************** API Endpoints Functions ***************************************************
/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @returns {Object} - list of the batches.
 */
const getAllBatches = (request, response) => {
    knex.select()
        .from('batches')
        .then((batches) => response.status(200).json({
            status: 'success',
            data: batches,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data from batch table, getBatches',
            data: error,
        }));
};


module.exports = {
    batchIdQuery,
    getAllBatches,
};
