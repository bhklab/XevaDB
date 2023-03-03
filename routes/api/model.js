/* eslint-disable func-names */
const knex = require('../../db/knex1');
const { getAllowedDatasetIds } = require('./util');

// ***********************= Model Queries *********=***********************************
/**
 * @returns {Object} - All models query
 */
const getAllModelsQuery = () => knex.select()
    .from('models as m')
    .leftJoin('patients as p', 'p.patient_id', 'm.patient_id')
    .leftJoin('datasets as d', 'd.dataset_id', 'p.dataset_id');

/**
 * @returns {Object} - All models detailed query with patient, dataset and tissue information
 */
const getAllModelsDetailedQuery = () => knex.select()
    .from('models as m')
    .leftJoin('patients as p', 'p.patient_id', 'm.patient_id')
    .leftJoin('datasets as d', 'd.dataset_id', 'p.dataset_id')
    .leftJoin('datasets_tissues as dt', 'dt.dataset_id', 'd.dataset_id')
    .leftJoin('tissues as t', 't.tissue_id', 'dt.tissue_id');

/**
 * @returns {Object} - Query to select the model count grouped by tissue type
 */
const getModelCountByTissueTypeQuery = () => knex.select('t.tissue_id', 't.tissue_name')
    .countDistinct('m.model_id as modelCount')
    .from('models as m')
    .leftJoin('patients as p', 'p.patient_id', 'm.patient_id')
    .leftJoin('datasets as d', 'd.dataset_id', 'p.dataset_id')
    .leftJoin('datasets_tissues as dt', 'dt.dataset_id', 'd.dataset_id')
    .leftJoin('tissues as t', 't.tissue_id', 'dt.tissue_id')
    .groupBy('t.tissue_id');

/**
* @returns {Object} - Query to select the model count grouped by class names
*/
const getModelCountByDrugClassQuery = () => knex.select('class_name')
    .from('model_information')
    .countDistinct('model_information.model_id as modelCount')
    .leftJoin(
        'drugs',
        'model_information.drug_id',
        'drugs.drug_id',
    )
    .leftJoin(
        'drug_annotations',
        'drugs.drug_id',
        'drug_annotations.drug_id',
    )
    .groupBy('class_name')
    .orderBy('modelCount');

// *****************************= Transform Functions **=***************************************
/**
 *
 * @param {Array} data - array of data that has to be transformed
 * @returns {Array} - array of the transformed data
 */
const transformAllModelsData = (data) => (
    data.map((value) => (
        {
            id: value.model_id,
            name: value.model,
        }
    ))
);

/**
 *
 * @param {Array} data - array of the data that has to be transformed
 * @returns {Array} - array of the
 */
const transformAllModelsDetailedData = (data) => (
    data.map((value) => ({
        id: value.model_id,
        name: value.model,
        tissue: {
            id: value.tissue_id,
            name: value.tissue_name,
        },
        patient: {
            id: value.patient_id,
            name: value.patient,
        },
        dataset: {
            id: value.dataset_id,
            name: value.dataset_name,
        },
    }))
);

// *************************= API Endpoint Functions *******=**********************************
/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @param {string} response.locals.user - whether the user is verified or not ('unknown').
 * @returns {Object} - list of the models.
 */
const getAllModels = (request, response) => {
    // user variable.
    const { user } = response.locals;

    // select the models.
    getAllModelsQuery()
        .whereBetween('d.dataset_id', getAllowedDatasetIds(user))
        .orderBy('m.model_id')
        .then((data) => transformAllModelsData(data))
        .then((models) => response.status(200).json({
            status: 'success',
            models,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data from model table, getAllModels',
            data: error,
        }));
};

/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @param {string} response.locals.user - whether the user is verified or not ('unknown').
 * @returns {Object} - list of the models with the dataset, tissue and patient object/information.
 */
const getModelsDetailedInformation = function (request, response) {
    // user variable.
    const { user } = response.locals;

    // query.
    getAllModelsDetailedQuery()
        .whereBetween('d.dataset_id', getAllowedDatasetIds(user))
        .orderBy('m.model_id')
        .then((data) => transformAllModelsDetailedData(data))
        .then((models) => response.status(200).json({
            status: 'success',
            models,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data from models table, getModelsDetailedInformation',
            data: error,
        }));
};

/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @param {string} response.locals.user - whether the user is verified or not ('unknown').
 * @returns {Object} - model count grouped by tissue type.
 */
const getModelCountByTissueType = (request, response) => {
    // user variable.
    const { user } = response.locals;

    // select models grouped by tissues.
    getModelCountByTissueTypeQuery()
        .whereBetween('d.dataset_id', getAllowedDatasetIds(user))
        .orderBy('t.tissue_id', 'asc')
        .then((tissue) => response.status(200).json({
            status: 'success',
            data: tissue,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data for getModelCountByTissueType API end point.',
            data: error,
        }));
};

/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @param {string} response.locals.user - whether the user is verified or not ('unknown').
 * @returns {Object} - model count grouped by drug class.
 */
const getModelCountByDrugClass = (request, response) => {
    // user variable.
    const { user } = response.locals;

    // select the number of patients and models grouped by drug class name.
    getModelCountByDrugClassQuery()
        .whereBetween('model_information.dataset_id', getAllowedDatasetIds(user))
        .then((className) => response.status(200).json({
            status: 'success',
            data: className,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data from getModelCountByDrugClass',
            data: error,
        }));
};

module.exports = {
    getAllModels,
    getModelsDetailedInformation,
    getModelCountByTissueType,
    getModelCountByDrugClass,
};
