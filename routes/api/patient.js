/* eslint-disable func-names */
const knex = require('../../db/knex1');
const { getAllowedDatasetIds } = require('./util');


/**
 * @param {Object} request - request object.
 * @param {Object} response - response object with authorization header.
 * @param {string} response.locals.user - whether the user is verified or not ('unknown').
 * @returns {Object} - list of the patients.
 */
const getPatients = (request, response) => {
    // user variable.
    const { user } = response.locals;

    // query.
    knex.select()
        .from('patients')
        .whereBetween('dataset_id', getAllowedDatasetIds(user))
        .orderBy('patient_id')
        .then((patients) => response.status(200).json({
            status: 'success',
            data: patients,
        }))
        .catch((error) => response.status(500).json({
            status: 'could not find data from patients table, getPatients',
            data: error,
        }));
};


module.exports = {
    getPatients,
};
