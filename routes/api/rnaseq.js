/* eslint-disable camelcase */
const knex = require('../../db/knex1');
const { isVerified } = require('./util');
const { distinctPatientsQuery, geneListQuery } = require('./helper');


// rna sequencing data.
const rnaSeqQuery = () => knex.select('genes.gene_name', 'patients.patient', 'rna_sequencing.value')
    .from('rna_sequencing')
    .rightJoin(
        'genes',
        'rna_sequencing.gene_id',
        'genes.gene_id',
    )
    .leftJoin(
        'modelid_moleculardata_mapping',
        'rna_sequencing.sequencing_uid',
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
        'modelid_moleculardata_mapping.sequencing_uid',
        'sequencing.sequencing_uid',
    );


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


/**
 * @param {Object} request - request object.
 * @param {number} request.params.dataset - dataset id.
 * @param {Object} response - response object with authorization header.
 * @returns {Object} - rna sequencing data based on the dataset id.
 */
const getRnaSeqDataBasedOnDataset = async (request, response) => {
    // dataset param.
    const datasetParam = request.params.dataset;

    if (isVerified(response, datasetParam)) {
        try {
            // grabbing the rna_sequencing data based on patients and limiting genes to 1-30.
            const rnaSeqData = await rnaSeqQuery().where('model_information.dataset_id', datasetParam)
                .andWhereBetween('rna_sequencing.gene_id', [1, 30])
                .orderBy('genes.gene_id')
                .orderBy('sequencing.sequencing_uid');

            // transforming the data.
            const transformedData = transformData(JSON.parse(JSON.stringify(rnaSeqData)));

            // sending the response.
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
    // dataset and gene query parameters.
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

            // grabbing the rna_sequencing data for the genes.
            const rnaSeqData = await rnaSeqQuery().where('model_information.dataset_id', datasetParam)
                .whereIn('rna_sequencing.gene_id', genesArray)
                .orderBy('genes.gene_id')
                .orderBy('sequencing.sequencing_uid');

            // transforming the data.
            const transformedData = transformData(JSON.parse(JSON.stringify(rnaSeqData)));
            // array of all the patients belonging to a particular dataset.
            transformedData.push(patientsArray);

            // sending the response.
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
