/* eslint-disable func-names */
const knex = require('../../db/knex1');


// get all the data from the models table.
const getModels = function (request, response) {
    // if the user is not logged in the dataset id's would be between 1 to 6, else 1 to 8.
    const datasetArray = response.locals.user === 'unknown' ? [1, 6] : [1, 8];
    // query.
    knex.select('m.model_id', 'm.model', 'p.patient')
        .from('models as m')
        .leftJoin('model_information as mi', 'm.model_id', 'mi.model_id')
        .leftJoin('patients as p', 'p.patient_id', 'mi.patient_id')
        .whereBetween('mi.dataset_id', datasetArray)
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
