/* eslint-disable no-shadow */
/* eslint-disable array-callback-return */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable camelcase */
const knex = require('../../db/knex1');
const { isVerified } = require('./util');

// This will get the rna sequencing data for the selected dataset id.
const getRnaSeqBasedOnDataset = function (request, response) {
    const paramDataset = request.params.dataset;

    if (isVerified(response, paramDataset)) {
        // grabbing the rna_sequencing data based on patients and limiting genes to 1-30.
        knex.select('genes.gene_name', 'patients.patient', 'rna_sequencing.value')
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
            )
            .where('model_information.dataset_id', paramDataset)
            .andWhereBetween('rna_sequencing.gene_id', [1, 30])
            .orderBy('genes.gene_id')
            .orderBy('sequencing.sequencing_uid')
            .then((rnaseq_data) => {
                let gene_id = '';
                const data = [];
                let i = 0;
                const usersRows = JSON.parse(JSON.stringify(rnaseq_data));
                usersRows.map((element) => {
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
                response.send(data);
            })
            .catch((error) => response.status(500).json({
                status: 'could not find data from rna_sequencing table, getRnaSeqBasedOnDataset',
                data: error,
            }));
    } else {
        response.status(500).json({
            status: 'Could not find data from rna_sequencing table, getRnaSeqBasedOnDataset',
            data: 'Bad Request',
        });
    }
};


// this will get the rna sequencing data based on
// dataset and drug query parameters.
const getRnaSeqBasedPerDatasetBasedOnGenes = function (request, response) {
    const paramGene = request.query.genes;
    const paramDataset = request.query.dataset;
    const genes = paramGene.split(',');

    if (isVerified(response, paramDataset)) {
        // get the distinct patients or total patients from model information table.
        // as some patient ids are missing from oncoprint because
        // data is not available for that patient/model.
        const modelInformationDistinctPatient = knex('model_information')
            .distinct('patients.patient')
            .from('model_information')
            .leftJoin(
                'patients',
                'model_information.patient_id',
                'patients.patient_id',
            )
            .where({
                dataset_id: paramDataset,
            });

        // to get the gene list based on gene_id param.
        const geneList = knex.select('gene_id')
            .from('genes')
            .whereIn('gene_name', genes);

        // rna_sequencing data.
        Promise.all([modelInformationDistinctPatient, geneList])
            .then((row) => {
                const data = [];
                // patients
                const patientRows = JSON.parse(JSON.stringify(row[0]));
                // parsing the gene_list in order to get an array of genes.
                let value = JSON.parse(JSON.stringify(row[1]));
                value = value.map((value) => value.gene_id);

                // grabbing the rna_sequencing data for the genes.
                knex.select('genes.gene_name', 'patients.patient', 'rna_sequencing.value')
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
                    )
                    .where('model_information.dataset_id', paramDataset)
                    .whereIn('rna_sequencing.gene_id', value)
                    .orderBy('genes.gene_id')
                    .orderBy('sequencing.sequencing_uid')
                    .then((rnasequencing_data) => {
                        let gene_id = '';
                        let i = 0;
                        const usersRows = JSON.parse(JSON.stringify(rnasequencing_data));
                        usersRows.map((element) => {
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
                status: 'could not find data from rna_sequencing table, getRnaSeqBasedPerDatasetBasedOnDrugs',
                data: error,
            }));
    } else {
        response.status(500).json({
            status: 'Could not find data from rna_sequencing table, getRnaSeqBasedPerDatasetBasedOnGenes',
            data: 'Bad Request',
        });
    }
};


module.exports = {
    getRnaSeqBasedOnDataset,
    getRnaSeqBasedPerDatasetBasedOnGenes,
};
