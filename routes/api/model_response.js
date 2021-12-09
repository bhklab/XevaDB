/* eslint-disable no-param-reassign */
const knex = require('../../db/knex1');
const { isVerified } = require('./util');
const { distinctPatientsQuery } = require('./helper');


/**
 * @param {string} datasetId
 * @returns {string} - returns the control based on the dataset id.
 */
const getControl = (datasetId) => {
    let control = '';
    if (datasetId === '7') {
        control = 'h2o';
    } else if (datasetId === '8') {
        control = 'control';
    } else {
        control = 'untreated';
    }
    return control;
};


/**
 * @param {string} - id of the dataset to be selected.
 * @returns {Object} - returns an object of mysql query builder to get the model information.
 */
const modelResponseQuery = (datasetParam) => knex
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
    .where('patients.dataset_id', datasetParam)
    .orderBy('drug_name')
    .orderBy('patient');


/**
 * @returns {Object} - returns an object of mysql query builder to
 * get the batch ids from batch information table.
 */
const batchIdQuery = () => knex.select('batch_information.batch_id', 'model_information.dataset_id')
    .from('batch_information')
    .rightJoin(
        'model_information',
        'batch_information.model_id',
        'model_information.model_id',
    )
    .rightJoin(
        'patients',
        'model_information.patient_id',
        'patients.patient_id',
    )
    .rightJoin(
        'drugs',
        'model_information.drug_id',
        'drugs.drug_id',
    );


/**
 * @param {Object} row - model response data.
 * @returns {Array} - returns the transformed response data in array format.
 */
const transformData = (row) => {
    // variables.
    let drug = '';
    let value = 0;
    const data = [];
    const untreated = {};

    // this will create enteries for heatmap.
    const usersRows = JSON.parse(JSON.stringify(row[1]));

    usersRows.forEach((element) => {
        // if the value is not present assign it NA.
        if (element.value === '') {
            element.value = 'NA';
        }
        // creating final data object.
        if (element.drug_name === drug) {
            if (!(element.patient in data[value - 1])) {
                data[value - 1][element.patient] = {};
            }
            data[value - 1][element.patient][element.response_type] = element.value;
        } else if (element.drug_name.match(/(^untreated$|^water$|^control$|^h2o$)/i)) {
            untreated.Drug = element.drug_name;
            if (!(element.patient in untreated)) {
                untreated[element.patient] = {};
            }
            untreated[element.patient][element.response_type] = element.value;
        } else {
            drug = element.drug_name;
            data.push({});
            data[value].Drug = element.drug_name;
            if (!(element.patient in data[value])) {
                data[value][element.patient] = {};
            }
            data[value][element.patient][element.response_type] = element.value;
            value += 1;
        }
    });

    if (Object.entries(untreated).length === 1 && untreated.constructor === Object) { }
    else { data.unshift(untreated); }

    // array of all the patients belonging to a particular dataset.
    const patients = JSON.parse(JSON.stringify(row[0])).map((element) => element.patient);
    data.push(patients);

    return data;
};


/**
 * @param {Object} request - request object with dataset param.
 * @param {number} request.params.dataset - id of the dataset to be queried.
 * @param {Object} response - response object
 * @returns {Object} - sends the model response data based on the dataset.
 */
const getModelResponseBasedOnDataset = (request, response) => {
    // dataset parameter.
    const datasetParam = request.params.dataset;
    // patients and model response.
    const patients = distinctPatientsQuery(datasetParam);
    const modelResponse = modelResponseQuery(datasetParam);

    // allows only if the dataset value is less than 6 and user is unknown or token is verified.
    if (isVerified(response, datasetParam)) {
        Promise.all([patients, modelResponse])
            .then((row) => {
                // transform the data fetched from the database.
                const data = transformData(row);
                // sending the response.
                response.send(data);
            })
            .catch((error) => response.status(500).json({
                status: 'could not find data from model_response table, getModelResponseBasedOnDataset',
                data: error,
            }));
    } else {
        response.status(500).json({
            status: 'could not find data from model_response table, getModelResponseBasedOnDataset',
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
const getModelResponseBasedOnDatasetAndDrugList = (request, response) => {
    // drug and dataset parameters.
    const drugParam = request.query.drug;
    const datasetParam = request.query.dataset;

    // get the array of drugs from the drug parameter.
    const drug = drugParam.split(',').map((value) => value.replace('_', ' + '));
    drug.push(getControl(datasetParam));

    // calling the functions to get patient and model response query.
    const patients = distinctPatientsQuery(datasetParam);
    const modelResponse = modelResponseQuery(datasetParam).whereIn('drugs.drug_name', drug);

    // allows only if the dataset value is less than 6 and user is unknown or token is verified.
    if (isVerified(response, datasetParam)) {
        Promise.all([patients, modelResponse])
            .then((row) => {
                // transform the data fetched from the database.
                const data = transformData(row);
                // sending the response.
                response.send(data);
            })
            .catch((error) => response.status(500).json({
                status: 'could not find data from model_response table, getModelResponseBasedPerDatasetBasedOnDrugs',
                data: error,
            }));
    } else {
        response.status(500).json({
            status: 'could not find data from model_response table, getModelResponseBasedPerDatasetBasedOnDrugs',
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
    const grabBatchId = batchIdQuery()
        .where('drugs.drug_name', drug)
        .andWhere('patients.patient', patient);

    grabBatchId.then((batch) => {
        // grab the dataset id.
        const dataset = JSON.parse(JSON.stringify(batch))[0].dataset_id;
        // check if it verified and the dataset id is greater than 0
        // or if it's not verified (unkown) then the dataset id should be less than 7.
        if (isVerified(response, dataset)) {
            knex.select()
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
                )
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
                    status: 'an error has occured in stats route at getModelResponseStats',
                    data: error,
                }));
        }
    });
};


module.exports = {
    getModelResponseBasedOnDataset,
    getModelResponseBasedOnDatasetAndDrugList,
    getModelResponseStatsBasedOnDrugAndPatient,
};
