/* eslint-disable func-names */
const knex = require('../../db/knex1');


// ************************************** Gene Queries ***************************************************
/**
 * @returns {Object} - returns a Knex query to select all the genes
 */
const getAllGenesQuery = () => knex.select()
    .from('genes');


// ************************************** API Endpoint Functions ******************************************
/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @returns {Object} - list of the genes in the database.
 */
const getAllGenes = (request, response) => {
    getAllGenesQuery()
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
