/* eslint-disable camelcase */
const knex = require('../../db/knex1');
const { isVerified } = require('./util');
const { distinctPatientsQuery, geneListQuery } = require('./helper');


// copy number variation query.
const copyNumberVariationQuery = () => knex
    .select('genes.gene_name', 'patients.patient', 'copy_number_variation.value')
    .from('copy_number_variation')
    .rightJoin(
        'genes',
        'copy_number_variation.gene_id',
        'genes.gene_id',
    )
    .leftJoin(
        'modelid_moleculardata_mapping',
        'copy_number_variation.sequencing_uid',
        'modelid_moleculardata_mapping.sequencing_uid',
    )
    .leftJoin(
        knex.select()
            .from('model_information')
            .groupBy('model_information.patient_id')
            .as('model_information'),
        'modelid_moleculardata_mapping.model_id',
        'model_information.model_id',
    )
    .leftJoin(
        'patients',
        'model_information.patient_id',
        'patients.patient_id',
    )
    .leftJoin(
        'sequencing',
        'copy_number_variation.sequencing_uid',
        'sequencing.sequencing_uid',
    );


/**
 * @param {Array} input - an array of the input data.
 * @returns {Array} - an array of the transformed data.
 */
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


/**
 * @param {Object} request - request object.
 * @param {number} request.params.dataset - dataset id.
 * @param {Object} response - response object with authorization header.
 * @returns {Object} - copy number variation data based on the dataset id.
 */
const getCopyNumberVariationDataBasedOnDataset = async (request, response) => {
    // dataset parameter.
    const datasetParam = request.params.dataset;

    // if verification passes.
    if (isVerified(response, datasetParam)) {
        try {
            // grabbing the copy_number_variation data based on patients and limiting genes to 1-30.
            const copyNumberVariationData = await copyNumberVariationQuery()
                .where('model_information.dataset_id', datasetParam)
                .andWhereBetween('copy_number_variation.gene_id', [1, 30])
                .orderBy('genes.gene_id')
                .orderBy('sequencing.sequencing_uid');

            // transforming the data.
            const transformedData = transformData(JSON.parse(JSON.stringify(copyNumberVariationData)));

            // sending the response.
            response.send(transformedData);
        } catch (error) {
            response.status(500).json({
                status: 'Could not find data from copy number table, getCopyNumberVariationBasedOnDataset',
                data: error,
            });
        }
    } else {
        response.status(500).json({
            status: 'Could not find data from copy number table, getCopyNumberVariationBasedOnDataset',
            data: 'Bad Request',
        });
    }
};


/**
 * @param {Object} request - request object.
 * @param {string} request.query.genes - list of genes to query.
 * @param {number} request.query.dataset - dataset id to query from.
 * @param {Object} response - response object with authorization header.
 * @returns {Object} - copy number variation data based on
 *  dataset and drug query parameters.
 */
const getCopyNumberVariationBasedOnDatasetAndGenes = async (request, response) => {
    const geneParam = request.query.genes;
    const datasetParam = request.query.dataset;

    if (isVerified(response, datasetParam)) {
        try {
            // getting the unique list of patients and genes.
            const patients = await distinctPatientsQuery(datasetParam);
            const genes = await geneListQuery(geneParam.split(','));

            // patients and genes array.
            const patientsArray = JSON.parse(JSON.stringify(patients)).map((element) => element.patient);
            const genesArray = JSON.parse(JSON.stringify(genes)).map((val) => val.gene_id);

            // grabbing the copy_number_variation data for the genes.
            const copyNumberVariationData = await copyNumberVariationQuery()
                .where('model_information.dataset_id', datasetParam)
                .whereIn('copy_number_variation.gene_id', genesArray)
                .orderBy('genes.gene_id')
                .orderBy('sequencing.sequencing_uid');

            // transforming the data.
            const transformedData = transformData(JSON.parse(JSON.stringify(copyNumberVariationData)));
            // array of all the patients belonging to a particular dataset.
            transformedData.push(patientsArray);

            // sending the response.
            response.send(transformedData);
        } catch (error) {
            response.status(500).json({
                status: 'Could not find data from copy number table, getCopyNumberVariationBasedPerDatasetBasedOnGenes',
                data: error,
            });
        }
    } else {
        response.status(500).json({
            status: 'Could not find data from copy number table, getCopyNumberVariationBasedPerDatasetBasedOnGenes',
            data: 'Bad Request',
        });
    }
};


module.exports = {
    getCopyNumberVariationDataBasedOnDataset,
    getCopyNumberVariationBasedOnDatasetAndGenes,
};
