const knex = require('../../db/knex1');

/**
 * @param {string} datasetId
 * @returns {string} - returns the control based on the dataset id.
 */
const getControl = (datasetId) => {
    let control = '';
    if (datasetId === '7') {
        control = 'h2o';
    } else if (datasetId === '8') {
        control = 'control';
    } else {
        control = 'untreated';
    }
    return control;
};

/**
 * @param {Array} genes - array of genes.
 * @returns {Object} - an array of gene ids based on the genes array param.
 */
// to select the gene ids based on the gene names.
const geneIdsBasedOnGeneNames = (genes) => knex
    .select('gene_id')
    .from('genes')
    .whereIn('gene_name', genes);

/**
 * @param {number} dataset - dataset id.
 * @returns {Object} - an array of the distinct drug ids and drug names based on the dataset id.
 */
const drugsBasedOnDatasetIdQuery = (dataset) => knex
    .distinct('drugs.drug_name as drug', 'drugs.drug_id')
    .from('datasets_drugs')
    .join('drugs', 'drugs.drug_id', 'datasets_drugs.drug_id')
    .where({ dataset_id: dataset });

/**
 * @param {number} dataset- dataset id to get the patient from particular dataset.
 * @returns {Object} - knex query to grab an array of distinct patients
 * for a particular dataset.
 */
const patientsBasedOnDatasetIdQuery = (dataset) => knex
    .distinct('patients.patient', 'patients.patient_id')
    .from('patients')
    .where({ dataset_id: dataset });

module.exports = {
    getControl,
    geneIdsBasedOnGeneNames,
    drugsBasedOnDatasetIdQuery,
    patientsBasedOnDatasetIdQuery,
};
