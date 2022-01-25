/* eslint-disable func-names */
const knex = require('../../db/knex1');
const { getAllowedDatasetIds } = require('./util');
const { getModelInformationDataQuery } = require('./model_information');


/**
 * @param {Object} data - model information input data.
 * @returns {Array} - returns an array of transformed data.
 */
const transformData = (data) => {
    // variable to store the final data.
    let finalData = [];
    // variable to store transformed data.
    const transformedData = [];


    // loop through and transform the data.
    data.forEach((element) => {
        if (!transformedData[element.patient]) {
            transformedData[element.patient] = {
                id: element.patient_id,
                name: element.patient,
                dataset: {
                    id: element.dataset_id,
                    name: element.dataset_name,
                },
                tissue: {
                    id: element.tissue_id,
                    name: element.tissue_name,
                },
                models: [{
                    id: element.model_id,
                    name: element.model,
                    drug: {
                        id: element.drug_id,
                        name: element.drug_name,
                    },
                }],
            };
        }

        if (transformedData[element.patient].models.filter((model) => model.name === element.model).length === 0) {
            transformedData[element.patient].models.push({
                id: element.model_id,
                name: element.model,
                drug: {
                    id: element.drug_id,
                    name: element.drug_name,
                },
            });
        }
    });

    // sorting the drugs and models based on the ids.
    finalData = Object.values(transformedData).map((row) => ({
        ...row,
        models: row.models.sort((a, b) => a.id - b.id),
    }));

    // returning the final data.
    return finalData;
};


/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @param {string} response.locals.user - whether the user is verified or not ('unknown').
 * @returns {Object} - list of the patients.
 */
const getPatients = (request, response) => {
    // user variable.
    const { user } = response.locals;

    // query.
    knex.select()
        .from('patients')
        .whereBetween('dataset_id', getAllowedDatasetIds(user))
        .orderBy('patient_id')
        .then((patients) => response.status(200).json({
            status: 'success',
            data: patients,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data from patients table, getPatients',
            data: error,
        }));
};


/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @param {string} response.locals.user - whether the user is verified or not ('unknown').
 * @returns {Object} - list of the patients with detailed information.
 */
const getPatientsDetailedInformation = (request, response) => {
    // user variable.
    const { user } = response.locals;

    // model information data.
    getModelInformationDataQuery()
        .whereBetween('d.dataset_id', getAllowedDatasetIds(user))
        .orderBy('p.patient_id')
        .then((modelInformationData) => transformData(modelInformationData))
        .then((data) => response.status(200).json({
            status: 'success',
            data,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data from model information table, getPatientsDetailedInformation',
            data: error,
        }));
};


/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @param {string} response.locals.user - whether the user is verified or not ('unknown').
 * @param {number} request.params.patient - patient parameter.
 * @returns {Object} - list of the patients with detailed information.
 */
const getPatientDetailedInformationBasedOnPatientId = (request, response) => {
    // user variable.
    const { user } = response.locals;

    // patient parameter.
    const { params: { id: patientParam } } = request;

    // model information data.
    getModelInformationDataQuery()
        .where('p.patient_id', patientParam)
        .whereBetween('d.dataset_id', getAllowedDatasetIds(user))
        .orderBy('p.patient_id')
        .then((modelInformationData) => transformData(modelInformationData))
        .then((data) => response.status(200).json({
            status: 'success',
            data,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data from model information table, getPatientsDetailedInformation',
            data: error,
        }));
};


module.exports = {
    getPatients,
    getPatientsDetailedInformation,
    getPatientDetailedInformationBasedOnPatientId,
};
