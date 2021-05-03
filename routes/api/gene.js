/* eslint-disable func-names */
const knex = require('../../db/knex1');


/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @returns {Object} - list of the genes in the database.
 */
const getGenes = (request, response) => {
    knex.select()
        .from('genes')
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
    getGenes,
};
