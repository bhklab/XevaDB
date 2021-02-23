/* eslint-disable func-names */
const knex = require('../../db/knex1');


// get all the data from the dataset table.
const getDatasets = function (request, response) {
    // if the user is not logged in the dataset id's would be between 1 to 6, else 1 to 8.
    const datasetArray = response.locals.user === 'unknown' ? [1, 6] : [1, 8];
    // select the datasets.
    knex.select()
        .from('datasets')
        .whereBetween('datasets.dataset_id', datasetArray)
        .then((dataset) => response.status(200).json({
            status: 'success',
            data: dataset,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data from dataset table, getDatasets',
            data: error,
        }));
};


// get all the count of distinct patient ids grouped by datasets,
// this uses the modelinformation table.
const getPatientsGroupedByDataset = function (request, response) {
    knex.countDistinct('model_information.patient_id as patient_id')
        .select('model_information.dataset_id', 'datasets.dataset_name')
        .from('model_information')
        .leftJoin(
            'datasets',
            'model_information.dataset_id',
            'datasets.dataset_id',
        )
        .groupBy('dataset_id')
        .then((dataset) => response.status(200).json({
            status: 'success',
            data: dataset,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data from dataset table, getDatasetTableData',
            data: error,
        }));
};


// get all the count of distinct model ids and patient ids grouped by datasets,
// this uses the modelinformation table.
const getModelsPatientsGroupedByDataset = function (request, response) {
    // if the user is not logged in the dataset id's would be between 1 to 6, else 1 to 8.
    const datasetArray = response.locals.user === 'unknown' ? [1, 6] : [1, 8];
    // select the number of patients and models grouped by dataset.
    knex.countDistinct('model_response.model_id as totalModels')
        .countDistinct('model_information.patient_id as patient_id')
        .select('datasets.dataset_name', 'datasets.dataset_id')
        .from('model_response')
        .leftJoin(
            'models',
            'model_response.model_id',
            'models.model_id',
        )
        .leftJoin(
            'model_information',
            'models.model_id',
            'model_information.model_id',
        )
        .leftJoin(
            'datasets',
            'model_information.dataset_id',
            'datasets.dataset_id',
        )
        .whereBetween('datasets.dataset_id', datasetArray)
        .groupBy('datasets.dataset_id')
        .then((dataset) => response.status(200).json({
            status: 'success',
            data: dataset,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data from dataset table, getDatasetTableData',
            data: error,
        }));
};


module.exports = {
    getDatasets,
    getPatientsGroupedByDataset,
    getModelsPatientsGroupedByDataset,
};
