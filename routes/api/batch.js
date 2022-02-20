/* eslint-disable func-names */
const knex = require('../../db/knex1');


/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @returns {Object} - list of the batches.
 */
const getAllBatches = (request, response) => {
    knex.select()
        .from('batches')
        .then((batches) => response.status(200).json({
            status: 'success',
            data: batches,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data from batch table, getBatches',
            data: error,
        }));
};


module.exports = {
    getAllBatches,
};
