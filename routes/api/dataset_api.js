/* eslint-disable func-names */
const knex = require('../../db/knex1');


// get all the data from the dataset table.
const getDatasets = function (request, response) {
    knex.select()
        .from('datasets')
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


module.exports = {
    getDatasets,
    getPatientsGroupedByDataset,
};
