/* eslint-disable func-names */
const knex = require('../../db/knex1');
const { getAllowedDatasetIds } = require('./util');


/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @returns {Object} - list of the models with the dataset object/information.
 */
const getModels = function (request, response) {
    // user variable.
    const { user } = response.locals;
    // query.
    knex.select()
        .from('models as m')
        .leftJoin('patients as p', 'p.patient_id', 'm.patient_id')
        .leftJoin('datasets as d', 'd.dataset_id', 'p.dataset_id')
        .whereBetween('d.dataset_id', getAllowedDatasetIds(user))
        .then((data) => (
            data.map((value) => ({
                id: value.model_id,
                name: value.model,
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


module.exports = {
    getModels,
};
