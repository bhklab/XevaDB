/* eslint-disable no-restricted-globals */
/* eslint-disable consistent-return */
/* eslint-disable func-names */
const knex = require('../../db/knex1');


// this is the function for grabing the total for counter.
const getCounter = (request, response) => {
    // if the user is not logged in the dataset id's would be between 1 to 6, else 1 to 8.
    const datasetArray = response.locals.user === 'unknown' ? [1, 6] : [1, 8];
    // count distinct tissues, drugs, datasets, models and patients.
    const tissues = knex.queryBuilder().countDistinct('tissue_id as tissues')
        .from('model_information')
        .whereBetween('dataset_id', datasetArray);

    const drugs = knex.queryBuilder().countDistinct('drug_id as drugs')
        .from('model_information')
        .whereBetween('dataset_id', datasetArray);

    const patients = knex.queryBuilder().countDistinct('patient_id as patients')
        .from('model_information')
        .whereBetween('dataset_id', datasetArray);

    const models = knex.queryBuilder().countDistinct('model_id as models')
        .from('model_information')
        .whereBetween('dataset_id', datasetArray);

    const datasets = knex('datasets')
        .countDistinct('dataset_id as datasets')
        .whereBetween('dataset_id', datasetArray);

    Promise.all([tissues, drugs, patients, models, datasets])
        .then((data) => response.status(200).json({
            status: 'success',
            data,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find the data',
            data: error,
        }));
};


// checks the validity of the dataset id.
const isValidId = (request, response, next) => {
    if (!isNaN(request.params.dataset || request.params.patient)) return next();
    next(new Error('Invalid Id, Please enter a valid integer Id'));
};


module.exports = {
    getCounter,
    isValidId,
};
