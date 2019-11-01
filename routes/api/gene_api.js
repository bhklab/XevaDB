/* eslint-disable func-names */
const knex = require('../../db/knex1');


// get all the data from the genes table.
const getGenes = function (request, response) {
    knex.select()
        .from('genes')
        .then((gene) => response.status(200).json({
            status: 'success',
            data: gene,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data from genes table, getGenes',
            data: error,
        }));
};


module.exports = {
    getGenes,
};
