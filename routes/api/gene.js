/* eslint-disable func-names */
const knex = require('../../db/knex1');

/**
 *
 * @param genes {Array} - array of gene object
 * @returns {Array} - removing the data time string and returning a filtered array
 */
const removeUnwantedGenes = (genes) => {
    // regex is matching a string like '2022-03-01 00:00:00'
    const regex = new RegExp(/[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2}/, 'g');

    return genes.filter((geneObject) => !geneObject.gene_name.match(regex));
};

// ************************************** Gene Queries ******************************************
/**
 * @returns {Object} - returns a Knex query to select all the genes
 */
const getAllGenesQuery = () => knex.select()
    .from('genes');

// ************************************** API Endpoint Functions *********************************
/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @returns {Object} - list of the genes in the database.
 */
const getAllGenes = (request, response) => {
    getAllGenesQuery()
        .then((genes) => removeUnwantedGenes(genes))
        .then((genes) => response.status(200).json({
            status: 'success',
            data: genes,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data from genes table, getGenes',
            data: error,
        }));
};

module.exports = {
    getAllGenes,
};
