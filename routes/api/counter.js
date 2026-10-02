const knex = require('../../db/knex1');
const { getAllowedDatasetIds } = require('./util');

// count distinct tissues, drugs, datasets, models and patients.
// allowedDatasetIds is the query returned by getAllowedDatasetIds.
const tissues = (allowedDatasetIds) => knex.queryBuilder().countDistinct('tissue_id as tissues')
    .from('model_information')
    .whereIn('dataset_id', allowedDatasetIds);

const drugs = (allowedDatasetIds) => knex.queryBuilder().countDistinct('drug_id as drugs')
    .from('model_information')
    .whereIn('dataset_id', allowedDatasetIds);

const patients = (allowedDatasetIds) => knex.queryBuilder().countDistinct('patient_id as patients')
    .from('model_information')
    .whereIn('dataset_id', allowedDatasetIds);

const models = (allowedDatasetIds) => knex.queryBuilder().countDistinct('model_id as models')
    .from('model_information')
    .whereIn('dataset_id', allowedDatasetIds);

const datasets = (allowedDatasetIds) => knex('datasets')
    .countDistinct('dataset_id as datasets')
    .whereIn('dataset_id', allowedDatasetIds);

/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @param {string} response.locals.user - whether the user is verified or not ('unknown').
 * @returns {Object} - get the total count for the different data types ie tissue, model, drugs etc.
 * Private datasets are only counted for logged-in users.
 */
const getCounter = (request, response) => {
    // user variable.
    const { user } = response.locals;

    // grabbing the data for the counter.
    Promise.all([
        tissues(getAllowedDatasetIds(user)),
        drugs(getAllowedDatasetIds(user)),
        patients(getAllowedDatasetIds(user)),
        models(getAllowedDatasetIds(user)),
        datasets(getAllowedDatasetIds(user)),
    ])
        .then((data) => response.status(200).json({
            status: 'success',
            data,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find the data, getCounter',
            data: error,
        }));
};

module.exports = {
    getCounter,
};
