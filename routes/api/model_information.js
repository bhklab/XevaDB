/* eslint-disable func-names */
const knex = require('../../db/knex1');
const { isVerified } = require('./util');
const { getAllowedDatasetIds } = require('./util');

// query to get the data from model information table.
const getModelInformationData = knex.select()
    .from('model_information as mi')
    .leftJoin('datasets as d', 'd.dataset_id', 'mi.dataset_id')
    .leftJoin('models as m', 'm.model_id', 'mi.model_id')
    .leftJoin('patients as p', 'p.patient_id', 'mi.patient_id')
    .leftJoin('drugs as dg', 'dg.drug_id', 'mi.drug_id')
    .leftJoin('tissues as t', 't.tissue_id', 'mi.tissue_id');


// query to grab the distinct drug ids based on the dataset id.
const distinctDrug = (dataset) => (
    knex.distinct('drug_id')
        .from('model_information')
        .where({
            dataset_id: dataset,
        })
        .as('distinct_drugs')
);


// query to grab the distinct patient ids based on the dataset id.
const distinctPatient = (dataset) => (
    knex.distinct('patient_id')
        .from('patients')
        .where({
            dataset_id: dataset,
        })
        .as('distinct_patients')
);


/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @returns {Object} - returns a list of drugs and patients based on the dataset.
 */
const postDrugsandPatientsBasedOnDataset = (request, response) => {
    const dataset = request.body.label;

    // allows only if the dataset value is less than 6 and user is unknown or token is verified.
    if (isVerified(response, request.body.label)) {
        const drugs = knex
            .select('drugs.drug_name as drug', 'drugs.drug_id as drug_id')
            .from(distinctDrug(dataset))
            .leftJoin(
                'drugs',
                'distinct_drugs.drug_id',
                'drugs.drug_id',
            );

        const patients = knex
            .select('patients.patient as patient', 'patients.patient_id as patient_id')
            .from(distinctPatient(dataset))
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


/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @returns {Object} - model information data.
 */
const getModelInformation = (request, response) => {
    // user variable.
    const { user } = response.locals;

    // query
    getModelInformationData
        .whereBetween('d.dataset_id', getAllowedDatasetIds(user))
        .then((data) => response.status(200).json({
            status: 'success',
            data,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data from model information table, getModelInformation',
            data: error,
        }));
};


/**
 * @param {Object} request - request object.
 * @param {string} request.params.patient - patient id.
 * @param {Object} response - response object with authorization header.
 * @returns {Object} - model information data based on the patient id.
 */
const getModelInformationBasedOnPatient = (request, response) => {
    // user variable.
    const { user } = response.locals;
    // patient param.
    const patientId = request.params.patient;

    // query to grab the data based on the patient id.
    getModelInformationData
        .where('p.patient_id', patientId)
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


module.exports = {
    postDrugsandPatientsBasedOnDataset,
    getModelInformation,
    getModelInformationBasedOnPatient,
};
