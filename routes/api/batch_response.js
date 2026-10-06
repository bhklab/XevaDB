const knex = require('../../db/knex1');
const { canAccessDataset } = require('./util');
const { batchIdQuery } = require('./batch');
const { resolveDrugName } = require('./helper');

// ************************ API Endpoints Functions ***********************************
/**
 * @param {Object} request - request object
 * @param {string} request.query.drug - query drug parameter
 * @param {string} request.query.patient - patient query parameter
 * @param {Object} response - response object with authorization header
 * @returns {Object} - get the stats like AUC, Slope etc.
 * from batch response table based on drug and patient (model_id)
 */
const getBatchResponseStatsBasedOnDrugAndPatient = async (request, response) => {
    const drugParam = await resolveDrugName(request.query.drug);
    const patientParam = request.query.patient;

    // grabs the batch id based on the patient id and drug param passed.
    const batchId = batchIdQuery()
        .where('patients.patient', patientParam)
        .andWhere('drugs.drug_name', drugParam);

    batchId.then(async (batch) => {
        if (!batch || batch.length === 0) {
            return response.status(404).json({ status: 'no batch found', data: [] });
        }
        // grab the dataset id.
        const dataset = JSON.parse(JSON.stringify(batch))[0].dataset_id;
        // allows only if the dataset is public or the user is logged in.
        if (await canAccessDataset(response, dataset)) {
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
