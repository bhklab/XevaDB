const knex = require('../../db/knex1');
const { getAllowedDatasetIds } = require('./util');


// count distinct tissues, drugs, datasets, models and patients.
const tissues = (datasetArray) => knex.queryBuilder().countDistinct('tissue_id as tissues')
    .from('model_information')
    .whereBetween('dataset_id', datasetArray);

const drugs = (datasetArray) => knex.queryBuilder().countDistinct('drug_id as drugs')
    .from('model_information')
    .whereBetween('dataset_id', datasetArray);

const patients = (datasetArray) => knex.queryBuilder().countDistinct('patient_id as patients')
    .from('model_information')
    .whereBetween('dataset_id', datasetArray);

const models = (datasetArray) => knex.queryBuilder().countDistinct('model_id as models')
    .from('model_information')
    .whereBetween('dataset_id', datasetArray);

const datasets = (datasetArray) => knex('datasets')
    .countDistinct('dataset_id as datasets')
    .whereBetween('dataset_id', datasetArray);


/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @param {string} response.locals.user - whether the user is verified or not ('unknown').
 * @returns {Object} - get the total count for the different data types ie tissue, model, drugs etc.
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
