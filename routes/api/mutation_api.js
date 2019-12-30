/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable camelcase */
const knex = require('../../db/knex1');


// This will get the mutation for the selected dataset id.
const getMutationBasedOnDataset = function (request, response) {
    const paramDataset = request.params.dataset;
    console.log(paramDataset);
    // get the distinct patients or total patients from model information table.
    // as some patient ids are missing from oncoprint
    // because data is not available for that patient/model.
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

    // mutation data.
    modelInformationDistinctPatient
        .then((total) => {
            const patientRows = JSON.parse(JSON.stringify(total));
            const data = [];
            // grabbing the mutation data based on patients and limiting genes to 1-30.
            knex.select('genes.gene_name', 'patients.patient', 'mutation.value')
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
                )
                .where('model_information.dataset_id', paramDataset)
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
};


// this will get the mutation based on
// dataset and drug query parameters.
const getMutationBasedPerDatasetBasedOnGenes = function (request, response) {
    const paramGene = request.query.genes;
    const paramDataset = request.query.dataset;
    const genes = paramGene.split(',');

    // get the distinct patients or total patients from model information table.
    // as some patient ids are missing from oncoprint
    // because data is not available for that patient/model.
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

    // mutation data.
    Promise.all([modelInformationDistinctPatient, geneList])
        .then((row) => {
            const data = [];
            // patients
            const patientRows = JSON.parse(JSON.stringify(row[0]));
            // parsing the gene_list in order to get an array of genes.
            let value = JSON.parse(JSON.stringify(row[1]));
            value = value.map((val) => val.gene_id);

            // grabbing the mutation data for the genes.
            knex.select('genes.gene_name', 'patients.patient', 'mutation.value')
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
                )
                .where('model_information.dataset_id', paramDataset)
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
};


module.exports = {
    getMutationBasedOnDataset,
    getMutationBasedPerDatasetBasedOnGenes,
};
