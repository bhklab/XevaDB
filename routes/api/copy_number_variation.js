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
const getCopyNumberVariationBasedOnDataset = function (request, response) {
    // dataset parameter.
    const datasetParam = request.params.dataset;

    if (isVerified(response, datasetParam)) {
        // grabbing the copy_number_variation data based on patients and limiting genes to 1-30.
        copyNumberVariationQuery
            .where('model_information.dataset_id', datasetParam)
            .andWhereBetween('copy_number_variation.gene_id', [1, 30])
            .orderBy('genes.gene_id')
            .orderBy('sequencing.sequencing_uid')
            .then((copy_number_variation_data) => {
                let gene_id = '';
                let i = 0;
                const data = [];
                const usersRows = JSON.parse(JSON.stringify(copy_number_variation_data));
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
            })
            .catch((error) => response.status(500).json({
                status: 'could not find data from copy_number_variation table, getcopy_number_variationBasedOnDataset',
                data: error,
            }));
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
const getCopyNumberVariationBasedPerDatasetBasedOnGenes = function (request, response) {
    const paramGene = request.query.genes;
    const datasetParam = request.query.dataset;
    const genes = paramGene.split(',');

    if (isVerified(response, datasetParam)) {
        // copy_number_variation data.
        Promise.all([distinctPatients(datasetParam), geneList(genes)])
            .then((row) => {
                const data = [];
                // patients
                const patientRows = JSON.parse(JSON.stringify(row[0]));
                // parsing the gene_list in order to get an array of genes.
                let value = JSON.parse(JSON.stringify(row[1]));
                value = value.map((val) => val.gene_id);

                // grabbing the copy_number_variation data for the genes.
                copyNumberVariationQuery
                    .where('model_information.dataset_id', datasetParam)
                    .whereIn('copy_number_variation.gene_id', value)
                    .orderBy('genes.gene_id')
                    .orderBy('sequencing.sequencing_uid')
                    .then((copy_number_variation_data) => {
                        let gene_id = '';
                        let i = 0;
                        const usersRows = JSON.parse(JSON.stringify(copy_number_variation_data));
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
                        const patient = patientRows.map((element) => element.patient);
                        data.push(patient);

                        // sending the response.
                        response.send(data);
                    });
            })
            .catch((error) => response.status(500).json({
                status: 'could not find data from copy_number_variation table, getcopy_number_variationBasedPerDatasetBasedOnDrugs',
                data: error,
            }));
    } else {
        response.status(500).json({
            status: 'Could not find data from copy number table, getCopyNumberVariationBasedPerDatasetBasedOnGenes',
            data: 'Bad Request',
        });
    }
};


module.exports = {
    getCopyNumberVariationBasedOnDataset,
    getCopyNumberVariationBasedPerDatasetBasedOnGenes,
};
