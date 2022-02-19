const knex = require('../../db/knex1');
const { isVerified } = require('./util');
const { getAllowedDatasetIds } = require('./util');


// ************************************** Dataset Queries ***************************************************
/**
 * @returns {Object} - knex query to get data for all datasets
 */
const getAllDatasetsQuery = () => knex.select()
    .from('datasets');


/**
 * @return {Object} - knex query to get detailed information for all datasets
 */
const getAllDatasetDetailQuery = () => knex.select()
    .from('datasets as d')
    .leftJoin('datasets_tissues as dt', 'dt.dataset_id', 'dt.dataset_id')
    .leftJoin('tissues as t', 't.tissue_id', 'dt.tissue_id')
    .leftJoin('patients as p', 'p.dataset_id', 'd.dataset_id')
    .leftJoin('models as m', 'm.patient_id', 'p.patient_id');


// ************************************** Transform Functions *************************************************
/**
 * 
 * @param {Array} data - an array of input data
 * @returns {Array} - returns an array of transformed data
 */
const transformAllDatasetsData = (data) => (
    data.map((value) => (
        {
            id: value.dataset_id,
            name: value.dataset_name,
        }
    ))
);


/**
 * @param {Object} data - input data.
 * @returns {Object} - transformed data.
 */
const transformDatasetDetail = (data) => {
    const transformedData = {};
    data.forEach((value) => {
        if (!transformedData[value.dataset_name]) {
            transformedData[value.dataset_name] = {
                id: value.dataset_id,
                name: value.dataset_name,
                tissue: value.tissue_name,
                patients: [value.patient],
                models: [value.model],
            };
        }
        if (!transformedData[value.dataset_name].models.includes(value.model)) {
            transformedData[value.dataset_name].models.push(value.model);
        }
        if (!transformedData[value.dataset_name].patients.includes(value.patient)) {
            transformedData[value.dataset_name].patients.push(value.patient);
        }
    });
    return transformedData;
};


// ************************************** API Endpoint Functions *************************************************
/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @param {string} response.locals.user - whether the user is verified or not ('unknown').
 * @returns {Object} - list of the datasets.
 */
const getAllDatasets = (request, response) => {
    // user variable.
    const { user } = response.locals;

    // select the datasets.
    getAllDatasetsQuery()
        .whereBetween('datasets.dataset_id', getAllowedDatasetIds(user))
        .then((data) => transformAllDatasetsData(data))
        .then((datasets) => response.status(200).json({
            status: 'success',
            datasets,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data from dataset table, getDatasets function',
            data: error,
        }));
};


/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @param {string} response.locals.user - whether the user is verified or not ('unknown').
 * @returns {Object} - list of the datasets with detailed information including
 * patient information, tissue information, model information.
 */
const getAllDatasetsDetailedInformation = (request, response) => {
    // user variable.
    const { user } = response.locals;

    // select the number of patients and models grouped by dataset.
    getAllDatasetDetailQuery()
        .whereBetween('d.dataset_id', getAllowedDatasetIds(user))
        .then((data) => Object.values(transformDatasetDetail(data)))
        .then((datasets) => response.status(200).json({
            status: 'success',
            datasets,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data from getAllDatasetsDetailedInformation',
            data: error,
        }));
};


/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @param {string} response.locals.user - whether the user is verified or not ('unknown').
 * @returns {Object} - list of the datasets with detailed information including
 * patient information, tissue information, model information.
 */
const getSingleDatasetDetailedInformationBasedOnDatasetId = (request, response) => {
    // dataset param.
    const { params: { dataset: datasetParam } } = request;

    if (isVerified(response, datasetParam)) {
        // select the number of patients and models grouped by dataset.
        getAllDatasetDetailQuery()
            .where('d.dataset_id', datasetParam)
            .then((data) => Object.values(transformDatasetDetail(data)))
            .then((datasets) => response.status(200).json({
                status: 'success',
                datasets,
            }))
            .catch((error) => response.status(500).json({
                status: 'could not find data from getSingleDatasetDetailedInformationBasedOnDatasetId',
                data: error,
            }));
    }
};


module.exports = {
    getAllDatasets,
    getAllDatasetsDetailedInformation,
    getSingleDatasetDetailedInformationBasedOnDatasetId,
};
