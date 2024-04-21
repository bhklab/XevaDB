/* eslint-disable camelcase */
const knex = require('../../db/knex1');
const { isVerified } = require('./util');
const { geneIdsBasedOnGeneNames, patientsBasedOnDatasetIdQuery } = require('./helper');

// ************************* Mutation Queries *******************************************
// mutation data.
// Refactored mutationQuery to accept datasetId and geneIds parameters
const mutationQuery = (datasetId, geneIds) => knex.select('genes.gene_name', 'patients.patient', 'mutation.value')
    .from('mutation')
    .rightJoin('genes', 'mutation.gene_id', 'genes.gene_id')
    .leftJoin('modelid_moleculardata_mapping', 'mutation.sequencing_uid', 'modelid_moleculardata_mapping.sequencing_uid')
    .leftJoin(
        knex.select('patient_id', knex.raw('MAX(model_id) as model_id'), 'dataset_id')
            .from('model_information')
            .where('dataset_id', datasetId) // Include dataset_id in the subquery if logic permits
            .groupBy('patient_id')
            .as('model_information'),
        'modelid_moleculardata_mapping.model_id',
        'model_information.model_id'
    )
    .leftJoin('patients', 'model_information.patient_id', 'patients.patient_id')
    .leftJoin('sequencing', 'modelid_moleculardata_mapping.sequencing_uid', 'sequencing.sequencing_uid')
    .where('model_information.dataset_id', datasetId)
    .whereIn('mutation.gene_id', geneIds)
    .orderBy('genes.gene_id')
    .orderBy('sequencing.sequencing_uid');


// *************************** Transform Functions ****************************************
// transforming the input data.
const transformData = (input) => {
    // array to store mutation data .
    const data = [];
    let gene_id = '';
    let i = 0;
    // transforming the data.
    input.forEach((element) => {
        if (element.gene_name !== gene_id) {
            gene_id = element.gene_name;
            data[i] = {};
            data[i].gene_id = element.gene_name;
            data[i][element.patient] = element.value;
            i += 1;
        } else {
            data[i - 1][element.patient] = element.value;
        }
    });
    return data;
};

// ************************** API Endpoints Functions ***********************************
/**
 * @param {Object} request - request object.
 * @param {number} request.params.dataset - dataset id.
 * @param {Object} response - response object with authorization header.
 * @returns {Object} - mutation data based on the dataset id.
 */
const getMutationDataBasedOnDataset = async (request, response) => {
    // dataset param.
    const { params: { dataset: datasetParam } } = request;

    if (isVerified(response, datasetParam)) {
        try {
            // patients.
            const patients = await patientsBasedOnDatasetIdQuery(datasetParam);
            const patientRows = JSON.parse(
                JSON.stringify(patients),
            ).map((element) => element.patient);

            // grabbing the mutation data based on patients and limiting genes to 1-30.
            const mutationData = await mutationQuery().where('model_information.dataset_id', datasetParam)
                .andWhereBetween('mutation.gene_id', [1, 30])
                .orderBy('genes.gene_id')
                .orderBy('sequencing.sequencing_uid');

            // transforming the data.
            const transformedData = transformData(JSON.parse(JSON.stringify(mutationData)));
            // array of all the patients belonging to a particular dataset.
            transformedData.push(patientRows);

            // sending the response.
            response.send(transformedData);
        } catch (error) {
            response.status(500).json({
                status: 'Could not find data from mutation table, getMutationBasedOnDataset',
                data: error,
            });
        }
    } else {
        response.status(500).json({
            status: 'Could not find data from mutation table, getMutationBasedOnDataset',
            data: 'Bad Request',
        });
    }
};

/**
 * @param {Object} request - request object.
 * @param {string} request.query.genes - list of genes to query.
 * @param {number} request.query.dataset - dataset id to query from.
 * @param {Object} response - response object with authorization header.
 * @returns {Object} - mutation data based on
 *  dataset and drug query parameters.
 */
const getMutationDataBasedOnDatasetAndGenes = async (request, response) => {
    // gene and dataset param.
    const geneParam = request.query.genes;
    const datasetParam = request.query.dataset;

    if (isVerified(response, datasetParam)) {
        try {
            // getting the unique list of patients and genes.
            const patients = await patientsBasedOnDatasetIdQuery(datasetParam);
            const genes = await geneIdsBasedOnGeneNames(geneParam.split(','));

            const patientsArray = patients.map((element) => element.patient);
            const genesArray = genes.map((val) => val.gene_id);

            // Use dynamic parameters in mutationQuery
            const mutationData = await mutationQuery(datasetParam, genesArray);
            const transformedData = transformData(mutationData);
            transformedData.push(patientsArray);

            response.send(transformedData);
        } catch (error) {
            response.status(500).json({
                status: 'Could not find data from mutation table, getMutationBasedPerDatasetBasedOnDrugs',
                data: error,
            });
        }
    } else {
        response.status(500).json({
            status: 'Could not find data from mutation table, getMutationBasedPerDatasetBasedOnDrugs',
            data: 'Bad Request',
        });
    }
};

module.exports = {
    getMutationDataBasedOnDataset,
    getMutationDataBasedOnDatasetAndGenes,
};
