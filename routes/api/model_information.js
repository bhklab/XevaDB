/* eslint-disable func-names */
const knex = require('../../db/knex1');
const { isVerified } = require('./util');
const { getAllowedDatasetIds } = require('./util');
const { distinctPatientsQuery, distinctDrugsQuery } = require('./helper');


// ************************************** Model Information Queries ***************************************************
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


// ************************************** API Endpoints Functions ***************************************************
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
            status: 'could not find data from model information table, getModelInformation',
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
            status: 'could not find data from model information table, getModelInformationBasedOnPatient',
            data: error,
        }));
};


/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @param {number} request.body.label - dataset id.
 * @returns {Object} - returns a list of drugs and patients based on the dataset.
 */
const postDrugsandPatientsBasedOnDataset = (request, response) => {
    const dataset = request.body.label;

    // allows only if the dataset value is less than 6 and user is unknown or token is verified.
    if (isVerified(response, request.body.label)) {
        const drugs = knex
            .select('drugs.drug_name as drug', 'drugs.drug_id as drug_id')
            .from(distinctDrugsQuery(dataset).as('distinct_drugs'))
            .leftJoin(
                'drugs',
                'distinct_drugs.drug_id',
                'drugs.drug_id',
            );

        const patients = knex
            .select('patients.patient as patient', 'patients.patient_id as patient_id')
            .from(distinctPatientsQuery(dataset).as('distinct_patients'))
            .leftJoin(
                'patients',
                'distinct_patients.patient_id',
                'patients.patient_id',
            );

        Promise.all([drugs, patients])
            .then((data) => response.status(200).json({
                status: 'success',
                data,
            }))
            .catch((error) => response.status(500).json({
                status: 'could not find data from model_information table, postDrugandPatientBasedOnDataset',
                data: error,
            }));
    } else {
        response.status(500).json({
            status: 'Could not find data from model_information table, postDrugandPatientBasedOnDataset',
            data: 'Bad Request',
        });
    }
};


module.exports = {
    postDrugsandPatientsBasedOnDataset,
    getAllModelInformation,
    getSingleModelInformationBasedOnModelId,
    getModelInformationDataQuery,
};
