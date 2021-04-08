/* eslint-disable func-names */
const knex = require('../../db/knex1');


// get all the data from the patients table.
const getPatients = function (request, response) {
    // if the user is not logged in the dataset id's would be between 1 to 6, else 1 to 8.
    const datasetArray = response.locals.user === 'unknown' ? [1, 6] : [1, 8];
    // query.
    knex.distinct('p.patient_id')
        .select('patient', 'dataset_id')
        .from('patients as p')
        .leftJoin('model_information as m', 'p.patient_id', 'm.patient_id')
        .whereBetween('m.dataset_id', datasetArray)
        .then((patient) => response.status(200).json({
            status: 'success',
            data: patient,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data from patients table, getPatients',
            data: error,
        }));
};


module.exports = {
    getPatients,
};
