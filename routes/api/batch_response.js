const knex = require('../../db/knex1');
const { isVerified } = require('./util');
const { batchIdQuery } = require('./batch');

// ************************ API Endpoints Functions ***********************************
/**
 * @param {Object} request - request object
 * @param {string} request.query.drug - query drug parameter
 * @param {string} request.query.patient - patient query parameter
 * @param {Object} response - response object with authorization header
 * @returns {Object} - get the stats like AUC, Slope etc.
 * from batch response table based on drug and patient (model_id)
 */
const getBatchResponseStatsBasedOnDrugAndPatient = (request, response) => {
    // grabbing the drug parameters and dataset parameters.
    // this will remove the spaces in the drug name and replace
    // it with ' + ' ,example BKM120   LDE225 => BKM120 + LDE225
    const drugParam = request.query.drug
        .replace(/\s\s\s/g, ' + ')
        .replace(/\s\s/g, ' + ');
    const patientParam = request.query.patient;

    // grabs the batch id based on the patient id and drug param passed.
    const batchId = batchIdQuery()
        .where('patients.patient', patientParam)
        .andWhere('drugs.drug_name', drugParam);

    batchId.then((batch) => {
        // grab the dataset id.
        const dataset = JSON.parse(JSON.stringify(batch))[0].dataset_id;
        // check if it verified and the dataset id is greater than 0
        // or if it's not verified (unknown) then the dataset id should be less than 7.
        if (isVerified(response, dataset)) {
            knex.select()
                .from('batch_response')
                .leftJoin(
                    'batches',
                    'batch_response.batch_id',
                    'batches.batch_id',
                )
                .andWhere('batch_response.batch_id', JSON.parse(JSON.stringify(batch))[0].batch_id)
                .then((data) => {
                    response.send(data);
                })
                .catch((error) => response.status(500).json({
                    status: 'an error has occurred in stats route at getBatchResponseStats',
                    data: error,
                }));
        }
    });
};

module.exports = {
    getBatchResponseStatsBasedOnDrugAndPatient,
};
