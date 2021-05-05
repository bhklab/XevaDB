/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable camelcase */
const knex = require('../../db/knex1');
const { isVerified } = require('./util');
const { distinctPatients, geneList } = require('./helper');


// mutation data.
const mutation = knex.select('genes.gene_name', 'patients.patient', 'mutation.value')
    .from('mutation')
    .rightJoin(
        'genes',
        'mutation.gene_id',
        'genes.gene_id',
    )
    .leftJoin(
        'modelid_moleculardata_mapping',
        'mutation.sequencing_uid',
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


/**
 * @param {Object} request - request object.
 * @param {number} request.params.dataset - dataset id.
 * @param {Object} response - response object with authorization header.
 * @returns {Object} - mutation data based on the dataset id.
 */
const getMutationDataBasedOnDataset = function (request, response) {
    const datasetParam = request.params.dataset;

    if (isVerified(response, datasetParam)) {
        // mutation data.
        distinctPatients(datasetParam)
            .then((total) => {
                const patientRows = JSON.parse(JSON.stringify(total));
                const data = [];
                // grabbing the mutation data based on patients and limiting genes to 1-30.

                mutation.where('model_information.dataset_id', datasetParam)
                    .andWhereBetween('mutation.gene_id', [1, 30])
                    .orderBy('genes.gene_id')
                    .orderBy('sequencing.sequencing_uid')
                    .then((mutation_data) => {
                        let gene_id = '';
                        let i = 0;
                        const usersRows = JSON.parse(JSON.stringify(mutation_data));
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
                status: 'could not find data from mutation table, getMutationBasedOnDataset',
                data: error,
            }));
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
const getMutationDataBasedOnDatasetAndGenes = function (request, response) {
    const paramGene = request.query.genes;
    const datasetParam = request.query.dataset;
    const genes = paramGene.split(',');

    if (isVerified(response, datasetParam)) {
        // mutation data.
        Promise.all([distinctPatients(datasetParam), geneList(genes)])
            .then((row) => {
                const data = [];
                // patients
                const patientRows = JSON.parse(JSON.stringify(row[0]));
                // parsing the gene_list in order to get an array of genes.
                let value = JSON.parse(JSON.stringify(row[1]));
                value = value.map((val) => val.gene_id);

                // grabbing the mutation data for the genes.
                mutation
                    .where('model_information.dataset_id', datasetParam)
                    .whereIn('mutation.gene_id', value)
                    .orderBy('genes.gene_id')
                    .orderBy('sequencing.sequencing_uid')
                    .then((mutation_data) => {
                        let gene_id = '';
                        let i = 0;
                        const usersRows = JSON.parse(JSON.stringify(mutation_data));
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
                status: 'could not find data from mutation table, getMutationBasedPerDatasetBasedOnDrugs',
                data: error,
            }));
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
