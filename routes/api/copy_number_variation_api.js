/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable camelcase */
const knex = require('../../db/knex1');


// This will get the copy_number_variation for the selected dataset id.
const getCopyNumberVariationBasedOnDataset = function (request, response) {
    const paramDataset = request.params.dataset;

    // grabbing the copy_number_variation data based on patients and limiting genes to 1-30.
    knex.select('genes.gene_name', 'patients.patient', 'copy_number_variation.value')
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
        )
        .where('model_information.dataset_id', paramDataset)
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
};


// this will get the copy_number_variation based on
// dataset and drug query parameters.
const getCopyNumberVariationBasedPerDatasetBasedOnGenes = function (request, response) {
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
    const gene_list = knex.select('gene_id')
        .from('genes')
        .whereIn('gene_name', genes);

    // copy_number_variation data.
    Promise.all([modelInformationDistinctPatient, gene_list])
        .then((row) => {
            const data = [];
            // patients
            const patientRows = JSON.parse(JSON.stringify(row[0]));
            // parsing the gene_list in order to get an array of genes.
            let value = JSON.parse(JSON.stringify(row[1]));
            value = value.map((val) => val.gene_id);

            // grabbing the copy_number_variation data for the genes.
            knex.select('genes.gene_name', 'patients.patient', 'copy_number_variation.value')
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
                    'modelid_moleculardata_mapping.sequencing_uid',
                    'sequencing.sequencing_uid',
                )
                .where('model_information.dataset_id', paramDataset)
                .whereIn('copy_number_variation.gene_id', value)
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
};


module.exports = {
    getCopyNumberVariationBasedOnDataset,
    getCopyNumberVariationBasedPerDatasetBasedOnGenes,
};
