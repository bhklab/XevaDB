/* eslint-disable func-names */
const knex = require('../../db/knex1');
const { getAllowedDatasetIds } = require('./util');

// ************************** Model Information Queries **************************************
/**
 * @returns {Object} - knex query to fetch the data from model information table.
 */
const getModelInformationDataQuery = () => knex.select()
    .from('model_information as mi')
    .leftJoin('datasets as d', 'd.dataset_id', 'mi.dataset_id')
    .leftJoin('models as m', 'm.model_id', 'mi.model_id')
    .leftJoin('patients as p', 'p.patient_id', 'mi.patient_id')
    .leftJoin('drugs as dg', 'dg.drug_id', 'mi.drug_id')
    .leftJoin('tissues as t', 't.tissue_id', 'mi.tissue_id');

// ****************************** API Endpoints Functions **************************************
/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @param {string} response.locals.user - whether the user is verified or not ('unknown').
 * @returns {Object} - model information data.
 */
const getAllModelInformation = async (request, response) => {
    // user variable.
    const { user } = response.locals;

    // model information data query
    try {
        // model information data.
        const modelInformationData = await getModelInformationDataQuery()
            .whereBetween('d.dataset_id', getAllowedDatasetIds(user))
            .orderBy('d.dataset_id');
        // sending the response back.
        response.status(200).json({
            status: 'success',
            data: modelInformationData,
        });
    } catch (error) {
        response.status(500).json({
            status: 'Could not find data from model information table, getAllModelInformation',
            data: error,
        });
    }
};

/**
 * @param {Object} request - request object.
 * @param {string} request.params.patient - patient id.
 * @param {Object} response - response object with authorization header.
 * @param {string} response.locals.user - whether the user is verified or not ('unknown').
 * @returns {Object} - model information data based on the patient id.
 */
const getSingleModelInformationBasedOnModelId = (request, response) => {
    // user variable.
    const { user } = response.locals;
    // model param.
    const { params: { model: modelParam } } = request;

    // query to grab the data based on the patient id.
    getModelInformationDataQuery()
        .where('m.model_id', modelParam)
        .andWhereBetween('d.dataset_id', getAllowedDatasetIds(user))
        .then((data) => response.status(200).json({
            status: 'success',
            data,
        }))
        .catch((error) => response.status(500).json({
            status: 'Could not find data from model information table, getSingleModelInformationBasedOnModelId',
            data: error,
        }));
};

module.exports = {
    getModelInformationDataQuery,
    getAllModelInformation,
    getSingleModelInformationBasedOnModelId,
};
