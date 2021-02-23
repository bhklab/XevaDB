/* eslint-disable func-names */
const knex = require('../../db/knex1');


// get all the data from the models table.
const getModels = function (request, response) {
    knex.select()
        .from('models')
        .then((model) => response.status(200).json({
            status: 'success',
            data: model,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data from models table, getModels',
            data: error,
        }));
};


module.exports = {
    getModels,
};
