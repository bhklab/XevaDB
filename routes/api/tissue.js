/* eslint-disable func-names */
const knex = require('../../db/knex1');


/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @returns {Object} - list of the tissues.
 */
const getTissues = (request, response) => {
    knex.select()
        .from('tissues')
        .then((tissue) => response.status(200).json({
            status: 'success',
            data: tissue,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data from tissue table, getTissues',
            data: error,
        }));
};


module.exports = {
    getTissues,
};
