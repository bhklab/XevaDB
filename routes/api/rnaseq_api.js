/* eslint-disable no-shadow */
/* eslint-disable array-callback-return */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable camelcase */
const knex = require('../../db/knex1');


// This will get the rna sequencing data for the selected dataset id.
const getRnaSeqBasedOnDataset = function (request, response) {
    const param_dataset = request.params.dataset;

    // to get the number of distinct patient ids.
    const distinctPatient = knex.distinct('modelid_moleculardata_mapping.sequencing_uid')
        .from('model_information')
        .leftJoin(
            'modelid_moleculardata_mapping',
            'model_information.model_id',
            'modelid_moleculardata_mapping.model_id',
        )
        .where('model_information.dataset_id', param_dataset)
        .andWhere('modelid_moleculardata_mapping.mDataType', 'RNASeq');

    // rna_sequencing data.
    distinctPatient
        .then(() => {
            // grabbing the rna_sequencing data based on patients and limiting genes to 1-30.
            knex.select('genes.gene_name', 'sequencing.sequencing_id', 'rna_sequencing.value')
                .from('rna_sequencing')
                .rightJoin(
                    'genes',
                    'rna_sequencing.gene_id',
                    'genes.gene_id',
                )
                .leftJoin(
                    'sequencing',
                    'rna_sequencing.sequencing_uid',
                    'sequencing.sequencing_uid',
                )
                .whereIn('rna_sequencing.sequencing_uid', distinctPatient)
                .andWhereBetween('rna_sequencing.gene_id', [1, 30])
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
                            data[i][element.sequencing_id] = element.value;
                            i++;
                        } else {
                            data[i - 1][element.sequencing_id] = element.value;
                        }
                    });
                    response.send(data);
                });
        })
        .catch((error) => response.status(500).json({
            status: 'could not find data from rna_sequencing table, getRnaSeqBasedOnDataset',
            data: error,
        }));
};


// this will get the rna sequencing data based on
// dataset and drug query parameters.
const getRnaSeqBasedPerDatasetBasedOnGenes = function (request, response) {
    const param_gene = request.query.genes;
    const param_dataset = request.query.dataset;
    const genes = param_gene.split(',');

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
            dataset_id: param_dataset,
        });

    // to get the number of distinct patient ids.
    const distinctPatient = knex.distinct('modelid_moleculardata_mapping.sequencing_uid')
        .from('model_information')
        .leftJoin(
            'modelid_moleculardata_mapping',
            'model_information.model_id',
            'modelid_moleculardata_mapping.model_id',
        )
        .where('model_information.dataset_id', param_dataset)
        .andWhere('modelid_moleculardata_mapping.mDataType', 'RNASeq');

    // to get the gene list based on gene_id param.
    const gene_list = knex.select('gene_id')
        .from('genes')
        .whereIn('gene_name', genes);

    // rna_sequencing data.
    Promise.all([modelInformationDistinctPatient, distinctPatient, gene_list])
        .then((row) => {
            const data = [];
            // patients
            const patientRows = JSON.parse(JSON.stringify(row[0]));
            // parsing the gene_list in order to get an array of genes.
            let value = JSON.parse(JSON.stringify(row[2]));
            value = value.map((value) => value.gene_id);
            // grabbing the rna_sequencing data for the genes.
            knex.select('genes.gene_name', 'sequencing.sequencing_id', 'rna_sequencing.value')
                .from('rna_sequencing')
                .rightJoin(
                    'genes',
                    'rna_sequencing.gene_id',
                    'genes.gene_id',
                )
                .leftJoin(
                    'sequencing',
                    'rna_sequencing.sequencing_uid',
                    'sequencing.sequencing_uid',
                )
                .whereIn('rna_sequencing.sequencing_uid', distinctPatient)
                .whereIn('rna_sequencing.gene_id', value)
                .then((rnasequencing_data) => {
                    let gene_id = '';
                    let i = 0;
                    const usersRows = JSON.parse(JSON.stringify(rnasequencing_data));
                    usersRows.map((element) => {
                        if (element.gene_name !== gene_id) {
                            gene_id = element.gene_name;
                            data[i] = {};
                            data[i].gene_id = element.gene_name;
                            data[i][element.sequencing_id] = element.value;
                            i++;
                        } else {
                            data[i - 1][element.sequencing_id] = element.value;
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
};


module.exports = {
    getRnaSeqBasedOnDataset,
    getRnaSeqBasedPerDatasetBasedOnGenes,
};
