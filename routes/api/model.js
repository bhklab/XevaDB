/* eslint-disable func-names */
const knex = require('../../db/knex1');
const { getAllowedDatasetIds } = require('./util');


/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @returns {Object} - list of the models.
 */
const getModels = (request, response) => {
    // user variable.
    const { user } = response.locals;

    // select the models.
    knex.select()
        .from('models as m')
        .leftJoin('patients as p', 'p.patient_id', 'm.patient_id')
        .leftJoin('datasets as d', 'd.dataset_id', 'p.dataset_id')
        .whereBetween('d.dataset_id', getAllowedDatasetIds(user))
        .orderBy('m.model_id')
        .then((data) => (
            data.map((value) => (
                {
                    id: value.model_id,
                    name: value.model,
                }
            ))
        ))
        .then((models) => response.status(200).json({
            status: 'success',
            models,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data from model table, getModels',
            data: error,
        }));
};


/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @returns {Object} - list of the models with the dataset, tissue and patient object/information.
 */
const getModelsDetailedInformation = function (request, response) {
    // user variable.
    const { user } = response.locals;

    // query.
    knex.select()
        .from('models as m')
        .leftJoin('patients as p', 'p.patient_id', 'm.patient_id')
        .leftJoin('datasets as d', 'd.dataset_id', 'p.dataset_id')
        .leftJoin('datasets_tissues as dt', 'dt.dataset_id', 'd.dataset_id')
        .leftJoin('tissues as t', 't.tissue_id', 'dt.tissue_id')
        .whereBetween('d.dataset_id', getAllowedDatasetIds(user))
        .orderBy('m.model_id')
        .then((data) => (
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
        ))
        .then((models) => response.status(200).json({
            status: 'success',
            models,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data from models table, getModels',
            data: error,
        }));
};


/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @returns {Object} - model count grouped by tissue type.
 */
const getModelsGroupedByTissueType = (request, response) => {
    // user variable.
    const { user } = response.locals;

    // select models grouped by tissues.
    knex.select('t.tissue_id', 't.tissue_name')
        .countDistinct('m.model_id as modelCount')
        .from('models as m')
        .leftJoin('patients as p', 'p.patient_id', 'm.patient_id')
        .leftJoin('datasets as d', 'd.dataset_id', 'p.dataset_id')
        .leftJoin('datasets_tissues as dt', 'dt.dataset_id', 'd.dataset_id')
        .leftJoin('tissues as t', 't.tissue_id', 'dt.tissue_id')
        .groupBy('t.tissue_id')
        .whereBetween('d.dataset_id', getAllowedDatasetIds(user))
        .orderBy('t.tissue_id', 'asc')
        .then((tissue) => response.status(200).json({
            status: 'success',
            data: tissue,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data for getModelsGroupedByTissueType API end point.',
            data: error,
        }));
};

/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @returns {Object} - model count grouped by drug class.
 */
const getModelsGroupedByDrugClass = (request, response) => {
    // user variable.
    const { user } = response.locals;

    // select the number of patients and models grouped by drug class name.
    knex('model_information')
        .countDistinct('model_information.model_id as model_ids')
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
        .select('class_name')
        .whereBetween('model_information.dataset_id', getAllowedDatasetIds(user))
        .groupBy('class_name')
        .then((className) => response.status(200).json({
            status: 'success',
            data: className,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data from getModelsGroupedByDrugClass',
            data: error,
        }));
};


module.exports = {
    getModels,
    getModelsDetailedInformation,
    getModelsGroupedByTissueType,
    getModelsGroupedByDrugClass,
};
