/* eslint-disable no-param-reassign */
const knex = require('../../db/knex1');
const { isVerified } = require('./util');
const { patientsBasedOnDatasetIdQuery, getControl } = require('./helper');
const { batchIdQuery } = require('./batch');

// **************************** Model Response Queries ****************************************
/**
 * @returns {Object} - returns an object of mysql query builder to get the model response
 */
const modelResponseQuery = () => knex
    .select('models.model_id', 'patients.patient', 'drugs.drug_name', 'value', 'response_type')
    .from('model_response')
    .rightJoin(
        'models',
        'models.model_id',
        'model_response.model_id',
    )
    .leftJoin(
        'patients',
        'patients.patient_id',
        'models.patient_id',
    )
    .leftJoin(
        'drugs',
        'drugs.drug_id',
        'model_response.drug_id',
    )
    .orderBy('drug_name')
    .orderBy('patient');

/**
 * @returns {Object} - returns an object of mysql query to get model response stats
 */
const modelResponseStatsQuery = () => knex.select()
    .from('model_response')
    .leftJoin(
        'model_information',
        'model_information.model_id',
        'model_response.model_id',
    )
    .leftJoin(
        'patients',
        'patients.patient_id',
        'model_information.patient_id',
    )
    .leftJoin(
        'drugs',
        'drugs.drug_id',
        'model_information.drug_id',
    )
    .leftJoin(
        'batch_information',
        'batch_information.model_id',
        'model_information.model_id',
    )
    .leftJoin(
        'models',
        'models.model_id',
        'model_information.model_id',
    )
    .leftJoin(
        'model_sheets',
        'model_sheets.model_id',
        'models.model',
    );

// ***************************** Transform Functions ***************************************
/**
 * @param {Object} input - model response data.
 * @returns {Array} - returns the transformed response data in array format.
 */
const transformData = (input) => {
    // final transformed data
    const data = {};

    // loop through the data and prepare the final data object
    input.forEach((row) => {
        // if the data object doesn't have 'drug property' then add one with the object
        if (!data.hasOwnProperty(row.drug_name)) {
            data[row.drug_name] = {
                Drug: row.drug_name,
            };
        }

        // if the data drug object doesn't have the 'patient property'
        // then add one and assign it to an empty object
        if (!data[row.drug_name].hasOwnProperty(row.patient)) {
            data[row.drug_name][row.patient] = {};
        }

        // checks for the response type and push the corresponding data
        if (data[row.drug_name][row.patient][row.response_type]) {
            data[row.drug_name][row.patient][row.response_type].push(row.value === '' ? 'NA' : row.value);
        } else {
            data[row.drug_name][row.patient][row.response_type] = [row.value === '' ? 'NA' : row.value];
        }
    });

    // find index of the drug object that matches either untreated, water, control or H20
    const controlIndex = Object.keys(data).findIndex((el) => el.match(/(^untreated$|^water$|^control$|^h2o$)/i));

    // final data; taking the values from data object
    const finalData = Object.values(data);

    // only if the control object is present at a location greater than 1
    if (controlIndex > 0 && controlIndex !== -1) {
        // gets the control data
        const controlData = Object.values(data)[controlIndex];

        // remove the data at index returned by controlIndex
        // and add controlObject at the start of the data
        finalData.splice(controlIndex, 1);
        finalData.unshift(controlData);
    }

    return finalData;
};

// ************************** API Endpoints Functions ***************************************
/**
 * @param {Object} request - request object with dataset param.
 * @param {number} request.params.dataset - id of the dataset to be queried.
 * @param {Object} response - response object
 * @returns {Object} - sends the model response data based on the dataset.
 */
const getModelResponsePerDataset = (request, response) => {
    // dataset parameter.
    const { params: { dataset: datasetParam } } = request;

    // model response.
    const modelResponse = modelResponseQuery().where('patients.dataset_id', datasetParam);

    // allows only if the dataset value is less than 6 and user is unknown or token is verified.
    if (isVerified(response, datasetParam)) {
        modelResponse
            .then((row) => {
                // transform the data fetched from the database.
                const data = transformData(row);
                // sending the response.
                response.send(data);
            })
            .catch((error) => response.status(500).json({
                status: 'Could not find data from model_response table, getModelResponsePerDataset',
                data: error,
            }));
    } else {
        response.status(500).json({
            status: 'Could not find data from model_response table, getModelResponsePerDataset',
            data: 'Bad Request',
        });
    }
};

/**
 * @param {Object} request - request object with dataset param.
 * @param {number} request.params.dataset - id of the dataset to be queried.
 * @param {string} request.params.drug - string of comma separated drugs.
 * @param {Object} response - response object
 * @returns {Object} - function returns the model response
 * based on dataset and drug query parameters.
*/
const getModelResponse = (request, response) => {
    // drug and dataset query parameters.
    const drugQueryParam = request.query.drug;
    const datasetQueryParam = request.query.dataset;
    let isUserVerified = false;
    const { user } = response.locals;

    // get the model response query.
    let modelResponse = modelResponseQuery();

    // get the array of drugs from the drug parameter.
    let drugArray = [];
    if (drugQueryParam) {
        // drug array from the input
        drugArray = drugQueryParam.split(',').map((value) => value.replace(/_/ig, ' + '));

        // update model response query if there is drug query parameter
        modelResponse = modelResponse.whereIn('drugs.drug_name', drugArray);
    }

    // get the patient array for the final data
    if (datasetQueryParam) {
        // update model response query if the dataset query param is available
        modelResponse = modelResponse.where('patients.dataset_id', datasetQueryParam);
        // if the dataset query param is passed use isVerified function
        isUserVerified = isVerified(response, datasetQueryParam);
    } else if (user === 'unknown') {
        isUserVerified = true;
        modelResponse = modelResponse.whereBetween('patients.dataset_id', [1, 6]);
    } else if (user.verified === 'verified') {
        isUserVerified = true;
        modelResponse = modelResponse.whereBetween('patients.dataset_id', [1, 8]);
    }

    // push control to drug array.
    if (drugQueryParam && datasetQueryParam) {
        drugArray.push(getControl(datasetQueryParam));
    }

    // allows only if the dataset value is less than 6 and user is unknown or token is verified.
    if (isUserVerified) {
        modelResponse
            .then((row) => {
                // transform the data fetched from the database.
                const data = transformData(row);
                // sending the response.
                response.send(data);
            })
            .catch((error) => response.status(500).json({
                status: 'Could not find data from model_response table, getModelResponseBasedPerDatasetBasedOnDrugs1',
                data: error,
            }));
    } else {
        response.status(500).json({
            status: 'Could not find data from model_response table, getModelResponseBasedPerDatasetBasedOnDrugs',
            data: 'Bad Request',
        });
    }
};

/**
 * @param {Object} request - request object with dataset param.
 * @param {string} request.params.drug - drug name.
 * @param {string} request.params.patient - patient name.
 * @param {Object} response - response object
 * @returns {Object} - returns the stats like AUC, Slope etc based on drug and patient (model_id).
 */
const getModelResponseStatsBasedOnDrugAndPatient = (request, response) => {
    // drug and dataset parameter.
    // this will remove the spaces in the drug name and replace
    // it with ' + ' ,example BKM120   LDE225 => BKM120 + LDE225
    const drug = request.query.drug.replace(/\s\s\s/g, ' + ').replace(/\s\s/g, ' + ');
    const { patient } = request.query;

    // grabs the batch ids based on the patient id and drug param passed.
    const getBatchId = batchIdQuery()
        .where('drugs.drug_name', drug)
        .andWhere('patients.patient', patient);

    getBatchId.then((batch) => {
        // grab the dataset id.
        const dataset = JSON.parse(JSON.stringify(batch))[0].dataset_id;
        // check if it verified and the dataset id is greater than 0
        // or if it's not verified (unknown) then the dataset id should be less than 7.
        if (isVerified(response, dataset)) {
            modelResponseStatsQuery()
                .where('patients.patient', patient)
                .andWhere(function () {
                    this.where('drugs.drug_name', drug)
                        .orWhereIn('drugs.drug_name', ['water', 'untreated', 'control', 'H2O']);
                })
                .andWhere('batch_id', JSON.parse(JSON.stringify(batch))[0].batch_id)
                .then((data) => {
                    response.send(data);
                })
                .catch((error) => response.status(500).json({
                    status: 'an error has occurred in stats route at getModelResponseStats',
                    data: error,
                }));
        }
    });
};

module.exports = {
    getModelResponsePerDataset,
    getModelResponse,
    getModelResponseStatsBasedOnDrugAndPatient,
};
