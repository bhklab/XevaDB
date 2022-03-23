/* eslint-disable camelcase */
/* eslint-disable func-names */
const knex = require('../../db/knex1');
const { getAllowedDatasetIds } = require('./util');
const { getModelInformationDataQuery } = require('./model_information');


// ************************************** Tissue Queries ***************************************************
/**
 * @returns {Object} - returns a query to fetch all the tissues
 */
const getAllTissuesQuery = () => knex.select()
    .from('tissues');


// ************************************** Transform Functions *************************************************
/**
 * @param {Object} data - input data.
 * @returns {Object} - transformed data.
 */
const transformTissueDetail = (data) => {
    const transformedData = {};
    data.forEach((value) => {
        const {
            tissue_name, tissue_id, dataset_name,
            patient, model, drug_name,
        } = value;
        // if the tissue is not available in the object.
        if (!transformedData[tissue_name]) {
            transformedData[tissue_name] = {
                id: tissue_id,
                name: tissue_name,
                datasets: {
                    [dataset_name]: {
                        name: dataset_name,
                        patients: [patient],
                        models: [model],
                        drugs: [drug_name],
                    },
                },
            };
        }
        // if the dataset is not in the object, add a new dataset.
        if (!transformedData[tissue_name].datasets[dataset_name]) {
            transformedData[tissue_name].datasets[dataset_name] = {
                name: dataset_name,
                patients: [patient],
                models: [model],
                drugs: [drug_name],
            };
        }

        // add models and patients accordingly.
        if (!transformedData[tissue_name].datasets[dataset_name].models.includes(model)) {
            transformedData[tissue_name].datasets[dataset_name].models.push(model);
        }
        if (!transformedData[tissue_name].datasets[dataset_name].patients.includes(patient)) {
            transformedData[tissue_name].datasets[dataset_name].patients.push(patient);
        }
        if (!transformedData[tissue_name].datasets[dataset_name].drugs.includes(drug_name)) {
            transformedData[tissue_name].datasets[dataset_name].drugs.push(drug_name);
        }
    });
    return transformedData;
};


// ************************************** API Endpoint Functions *************************************************
/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @returns {Object} - list of the tissues.
 */
const getAllTissues = (request, response) => {
    getAllTissuesQuery()
        .then((tissues) => response.status(200).json({
            status: 'success',
            data: tissues,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data from tissue table, getTissues',
            data: error,
        }));
};


/**
 * @param {Object} request - request object.
 * @param {string} request.params.tissue - tissue id.
 * @param {Object} response - response object with authorization header.
 * @param {string} response.locals.user - whether the user is verified or not ('unknown').
 * @returns {Object} - model information data based on the tissue id.
 */
const getSingleTissueDetailedInformationBasedOnTissueId = (request, response) => {
    // user variable.
    const { user } = response.locals;
    // tissue parameter.
    const { params: { tissue: tissueParam } } = request;

    // query to grab the data based on the tissue id.
    getModelInformationDataQuery()
        .where('t.tissue_id', tissueParam)
        .andWhereBetween('d.dataset_id', getAllowedDatasetIds(user))
        .then((data) => transformTissueDetail(data))
        .then((data) => response.status(200).json({
            status: 'success',
            data,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data from model information table, getTissueDetailedInformationBasedOnTissueId',
            data: error,
        }));
};


module.exports = {
    getAllTissues,
    getSingleTissueDetailedInformationBasedOnTissueId,
};
