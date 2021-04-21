/* eslint-disable func-names */
const knex = require('../../db/knex1');


// get all the data from the batches table.
const getBatches = (request, response) => {
    knex.select()
        .from('batches')
        .then((batch) => response.status(200).json({
            status: 'success',
            data: batch,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data from batch table, getBatches',
            data: error,
        }));
};


module.exports = {
    getBatches,
};
