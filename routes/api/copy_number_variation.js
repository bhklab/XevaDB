/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable camelcase */
const knex = require('../../db/knex1');
const { isVerified } = require('./util');
const { distinctPatients, geneList } = require('./helper');


// copy number variation query.
const copyNumberVariationQuery = knex.select('genes.gene_name', 'patients.patient', 'copy_number_variation.value')
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
        // grabbing the copy_number_variation data based on patients and limiting genes to 1-30.
        const copyNumberVariationData = await copyNumberVariationQuery
            .where('model_information.dataset_id', datasetParam)
            .andWhereBetween('copy_number_variation.gene_id', [1, 30])
            .orderBy('genes.gene_id')
            .orderBy('sequencing.sequencing_uid');

        // transforming the data.
        let gene_id = '';
        let i = 0;
        const data = [];
        const usersRows = JSON.parse(JSON.stringify(copyNumberVariationData));
        usersRows.forEach((element) => {
            if (element.gene_name !== gene_id) {
                gene_id = element.gene_name;
                data[i] = {};
                data[i].gene_id = element.gene_name;
                data[i][element.patient] = element.value;
                i++;
            } else {
                data[i - 1][element.patient] = element.value;
            }
        });

        // sending the response.
        response.send(data);
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
    const paramGene = request.query.genes;
    const datasetParam = request.query.dataset;

    if (isVerified(response, datasetParam)) {
        // copy_number_variation data array.
        const data = [];
        // getting the unique list of patients and genes.
        const patients = await distinctPatients(datasetParam);
        const genes = await geneList(paramGene.split(','));

        // patients and genes array.
        const patientsArray = JSON.parse(JSON.stringify(patients)).map((element) => element.patient);
        const genesArray = JSON.parse(JSON.stringify(genes)).map((val) => val.gene_id);


        // grabbing the copy_number_variation data for the genes.
        const copyNumberVariationData = await copyNumberVariationQuery
            .where('model_information.dataset_id', datasetParam)
            .whereIn('copy_number_variation.gene_id', genesArray)
            .orderBy('genes.gene_id')
            .orderBy('sequencing.sequencing_uid');

        // transforming the data into the required format.
        let gene_id = '';
        let i = 0;
        const usersRows = JSON.parse(JSON.stringify(copyNumberVariationData));
        usersRows.forEach((element) => {
            if (element.gene_name !== gene_id) {
                gene_id = element.gene_name;
                data[i] = {};
                data[i].gene_id = element.gene_name;
                data[i][element.patient] = element.value;
                i++;
            } else {
                data[i - 1][element.patient] = element.value;
            }
        });

        // array of all the patients belonging to a particular dataset.
        data.push(patientsArray);
        // sending the response.
        response.send(data);
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
