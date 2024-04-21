/* eslint-disable camelcase */
const knex = require('../../db/knex1');
const { isVerified } = require('./util');
const { geneIdsBasedOnGeneNames, patientsBasedOnDatasetIdQuery } = require('./helper');

// ******************************* RNASeq Queries *****************************************
// rna sequencing data.
const rnaSeqQuery = (datasetId, geneIds) => knex
    .select('genes.gene_name', 'patients.patient', 'rna_sequencing.value')
    .from('rna_sequencing')
    .rightJoin('genes', 'rna_sequencing.gene_id', 'genes.gene_id')
    .leftJoin('modelid_moleculardata_mapping', 'rna_sequencing.sequencing_uid', 'modelid_moleculardata_mapping.sequencing_uid')
    .leftJoin(
        knex.select('patient_id', knex.raw('MAX(model_id) as model_id'), 'dataset_id')
            .from('model_information')
            .where('dataset_id', datasetId) // Include filtering by dataset_id if applicable
            .groupBy('patient_id')
            .as('model_information'),
        'modelid_moleculardata_mapping.model_id',
        'model_information.model_id',
    )
    .leftJoin('patients', 'model_information.patient_id', 'patients.patient_id')
    .leftJoin('sequencing', 'rna_sequencing.sequencing_uid', 'sequencing.sequencing_uid')
    .where('model_information.dataset_id', datasetId)
    .whereIn('rna_sequencing.gene_id', geneIds)
    .orderBy('genes.gene_id')
    .orderBy('sequencing.sequencing_uid');


// ****************************** Transform Functions ****************************************
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

// **************************** API Endpoints Functions ***************************************
/**
 * @param {Object} request - request object.
 * @param {number} request.params.dataset - dataset id.
 * @param {Object} response - response object with authorization header.
 * @returns {Object} - rna sequencing data based on the dataset id.
 */
const getRnaSeqDataBasedOnDataset = async (request, response) => {
    const datasetParam = request.params.dataset;

    if (isVerified(response, datasetParam)) {
        try {
            const geneIds = Array.from({length: 30}, (_, i) => i + 1); // Assuming genes 1 to 30

            const rnaSeqData = await rnaSeqQuery(datasetParam, geneIds);
            const transformedData = transformData(rnaSeqData);
            response.send(transformedData);
        } catch (error) {
            response.status(500).json({
                status: 'Could not find data from rna_sequencing table, getRnaSeqBasedOnDataset',
                data: error,
            });
        }
    } else {
        response.status(500).json({
            status: 'Could not find data from rna_sequencing table, getRnaSeqBasedOnDataset',
            data: 'Bad Request',
        });
    }
};

/**
 * @param {Object} request - request object.
 * @param {string} request.query.genes - list of genes to query.
 * @param {number} request.query.dataset - dataset id to query from.
 * @param {Object} response - response object with authorization header.
 * @returns {Object} - rna sequencing data based on
 *  dataset and drug query parameters.
 */
const getRnaSeqBasedOnDatasetAndGenes = async (request, response) => {
    const geneParam = request.query.genes;
    const datasetParam = request.query.dataset;

    if (isVerified(response, datasetParam)) {
        try {
            const genes = await geneIdsBasedOnGeneNames(geneParam.split(','));
            const genesArray = genes.map((val) => val.gene_id);

            const rnaSeqData = await rnaSeqQuery(datasetParam, genesArray);
            const transformedData = transformData(rnaSeqData);
            response.send(transformedData);
        } catch (error) {
            response.status(500).json({
                status: 'Could not find data from rna_sequencing table, getRnaSeqBasedPerDatasetBasedOnGenes',
                data: error,
            });
        }
    } else {
        response.status(500).json({
            status: 'Could not find data from rna_sequencing table, getRnaSeqBasedPerDatasetBasedOnGenes',
            data: 'Bad Request',
        });
    }
};

module.exports = {
    getRnaSeqDataBasedOnDataset,
    getRnaSeqBasedOnDatasetAndGenes,
};
