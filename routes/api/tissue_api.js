/* eslint-disable func-names */
const knex = require('../../db/knex1');


// get all the data from the tissues table.
const getTissues = function (request, response) {
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


// this is grouping different modelids based on the different tissues.
const getModelsGroupedByTissue = function (request, response) {
    knex.select('model_information.tissue_id', 'tissues.tissue_name')
        .count('model_information.patient_id as total')
        .groupBy('model_information.tissue_id')
        .from('model_information')
        .leftJoin(
            'tissues',
            'model_information.tissue_id',
            'tissues.tissue_id',
        )
        .whereNot('model_information.tissue_id', '')
        .then((tissue) => response.status(200).json({
            status: 'success',
            data: tissue,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find tissue',
            data: error,
        }));
};


module.exports = {
    getTissues,
    getModelsGroupedByTissue,
};
