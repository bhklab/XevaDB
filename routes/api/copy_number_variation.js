/* eslint-disable camelcase */
const knex = require('../../db/knex1');
const { isVerified } = require('./util');
const { geneIdsBasedOnGeneNames, patientsBasedOnDatasetIdQuery } = require('./helper');

// *********************** Copy Number Variation Queries ***********************************
const copyNumberVariationQuery = (datasetId, geneIds) => knex
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
        knex.select('patient_id', knex.raw('MAX(model_id) as model_id'), 'dataset_id')
            .from('model_information')
            .where('dataset_id', datasetId)
            .groupBy('patient_id')
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
    )
    .where('model_information.dataset_id', datasetId)
    .whereIn('copy_number_variation.gene_id', geneIds)
    .orderBy('genes.gene_id')
    .orderBy('sequencing.sequencing_uid');


// **************************** Transform Functions *************************************
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

// *************************** API Endpoints Functions ***************************************
/**
 * @param {Object} request - request object.
 * @param {number} request.params.dataset - dataset id.
 * @param {Object} response - response object with authorization header.
 * @returns {Object} - copy number variation data based on the dataset id.
 */
const getCopyNumberVariationDataBasedOnDataset = async (request, response) => {
    const datasetParam = request.params.dataset;

    if (isVerified(response, datasetParam)) {
        try {
            const geneIds = Array.from({length: 30}, (_, i) => i + 1);

            const copyNumberVariationData = await copyNumberVariationQuery(datasetParam, geneIds);
            const transformedData = transformData(copyNumberVariationData);
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
            const genes = await geneIdsBasedOnGeneNames(geneParam.split(','));
            const genesArray = genes.map((val) => val.gene_id);

            const copyNumberVariationData = await copyNumberVariationQuery(datasetParam, genesArray);
            const transformedData = transformData(copyNumberVariationData);
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
