const knex = require('../../db/knex1');


/**
 * @param {number} datasetId - dataset id to get the patient from particular dataset.
 * @returns {Object} - knex query to grab an array of distinct patients
 * from a particular dataset.
 */
const distinctPatients = (datasetId) => knex
    .distinct('patients.patient')
    .from('patients')
    .where({
        'patients.dataset_id': datasetId,
    });


/**
 * @param {Array} genes - array of genes.
 * @returns {Array} - an array of gene ids based on the genes array param.
 */
// to select the gene ids based on the gene names.
const geneList = (genes) => knex.select('gene_id')
    .from('genes')
    .whereIn('gene_name', genes);


module.exports = {
    distinctPatients,
    geneList,
};
