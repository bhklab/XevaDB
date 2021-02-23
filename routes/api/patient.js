/* eslint-disable func-names */
const knex = require('../../db/knex1');


// get all the data from the patients table.
const getPatients = function (request, response) {
    knex.select()
        .from('patients')
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
